pipeline {
  agent { label 'jenkins-agent' }

  environment {
    AWS_REGION               = 'ap-northeast-2'
    ECR_REGISTRY             = '542119828072.dkr.ecr.ap-northeast-2.amazonaws.com'
    ECR_REPO                 = 'pantry-mate-dev-frontend'
    IMAGE_NAME               = "${ECR_REGISTRY}/${ECR_REPO}"
    GITOPS_REPO              = 'https://github.com/PantryMate-404NF/pantry-mate-gitops.git'
    GITOPS_APP_PATH          = 'environments/dev/cloud-test-front'
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Checkout') {
      steps {
        script {
          checkout scm
          env.IMAGE_TAG = sh(
            script: 'git rev-parse --short=8 HEAD',
            returnStdout: true
          ).trim()
        }
        sh 'git log --oneline -3'
      }
    }

    stage('Build & Push ECR') {
      steps {
        container('dind') {
          sh '''
            case "$NEXT_PUBLIC_API_BASE_URL" in
              https://?*) ;;
              *)
                echo "NEXT_PUBLIC_API_BASE_URL must be configured with an HTTPS URL"
                exit 1
                ;;
            esac

            # AWS CLI installation for Alpine musl
            apk add --no-cache python3 py3-pip
            pip3 install awscli --break-system-packages --quiet

            # ECR authentication uses the Jenkins agent's IRSA credentials.
            aws ecr get-login-password --region $AWS_REGION \
              | docker login --username AWS --password-stdin $ECR_REGISTRY

            # ECR tags are immutable, so reuse an image that already exists.
            if aws ecr describe-images --region $AWS_REGION \
                --repository-name $ECR_REPO \
                --image-ids imageTag=$IMAGE_TAG > /dev/null 2>&1; then
              echo "Image $IMAGE_TAG already in ECR, skipping build"
            else
              docker build \
                --build-arg NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
                -t $IMAGE_NAME:$IMAGE_TAG .
              docker push $IMAGE_NAME:$IMAGE_TAG
            fi
          '''
        }
      }
    }

    stage('Update GitOps') {
      when { branch 'main' }
      steps {
        container('dind') {
          withCredentials([usernamePassword(
            credentialsId: 'github-credentials',
            usernameVariable: 'GIT_USER',
            passwordVariable: 'GIT_TOKEN'
          )]) {
            sh '''
              apk add --no-cache git sed

              printf '%s\n' \
                '#!/bin/sh' \
                'case "$1" in' \
                '  *Username*) printf "%s\\n" "$GIT_USER" ;;' \
                '  *Password*) printf "%s\\n" "$GIT_TOKEN" ;;' \
                'esac' > "$WORKSPACE/.git-askpass"
              chmod 700 "$WORKSPACE/.git-askpass"
              export GIT_ASKPASS="$WORKSPACE/.git-askpass"
              export GIT_TERMINAL_PROMPT=0
              trap 'rm -f "$WORKSPACE/.git-askpass"' EXIT

              git clone "$GITOPS_REPO" gitops-repo
              cd gitops-repo
              git config user.email "jenkins@pantry-mate.internal"
              git config user.name "Jenkins CI"

              sed -i "s|image: $ECR_REGISTRY/$ECR_REPO:.*|image: $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG|g" \
                $GITOPS_APP_PATH/deployment.yaml

              if ! grep -Fq "image: $IMAGE_NAME:$IMAGE_TAG" "$GITOPS_APP_PATH/deployment.yaml"; then
                echo "Failed to update the GitOps image tag"
                exit 1
              fi

              git add $GITOPS_APP_PATH/deployment.yaml
              git diff --cached --quiet || git commit -m "ci: update frontend image to $IMAGE_TAG [skip ci]"
              git pull --rebase origin main
              git push origin main
            '''
          }
        }
      }
      post {
        always {
          container('dind') {
            sh 'rm -rf gitops-repo'
          }
        }
      }
    }
  }

  post {
    success { echo "frontend build complete: ${IMAGE_NAME}:${IMAGE_TAG}" }
    failure { echo 'pipeline failed; check the Jenkins logs' }
    cleanup {
      container('dind') {
        sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
      }
      cleanWs()
    }
  }
}

pipeline {
  agent { label 'jenkins-agent' }

  environment {
    AWS_REGION      = 'ap-northeast-2'
    ECR_REGISTRY    = '542119828072.dkr.ecr.ap-northeast-2.amazonaws.com'
    ECR_REPO        = 'pantry-mate-dev-frontend'
    IMAGE_NAME      = "${ECR_REGISTRY}/${ECR_REPO}"
    IMAGE_TAG       = "${GIT_COMMIT[0..7]}"
    GITOPS_REPO     = 'https://github.com/PantryMate-404NF/pantry-mate-gitops.git'
    GITOPS_APP_PATH           = 'environments/dev/cloud-test-front'
    NEXT_PUBLIC_API_BASE_URL  = 'https://api.unzipp.cloud'
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'git log --oneline -3'
      }
    }

    stage('Build & Push ECR') {
      steps {
        container('dind') {
          sh '''
            # AWS CLI 설치 (pip - Alpine musl 호환)
            apk add --no-cache python3 py3-pip
            pip3 install awscli --break-system-packages --quiet

            # ECR 로그인 (IRSA 자동 인증)
            aws ecr get-login-password --region $AWS_REGION \
              | docker login --username AWS --password-stdin $ECR_REGISTRY

            # 이미 ECR에 존재하면 빌드/푸시 스킵 (IMMUTABLE 정책)
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

              git clone https://$GIT_USER:$GIT_TOKEN@$(echo $GITOPS_REPO | sed 's|https://||') gitops-repo
              cd gitops-repo
              git config user.email "jenkins@pantry-mate.internal"
              git config user.name "Jenkins CI"

              sed -i "s|image: $ECR_REGISTRY/$ECR_REPO:.*|image: $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG|g" \
                $GITOPS_APP_PATH/deployment.yaml

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
    success  { echo "✅ frontend 빌드 완료: ${IMAGE_NAME}:${IMAGE_TAG}" }
    failure  { echo "❌ 파이프라인 실패 — 로그를 확인하세요." }
    cleanup  {
      container('dind') {
        sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
      }
      cleanWs()
    }
  }
}

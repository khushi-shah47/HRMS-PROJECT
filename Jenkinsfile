// pipeline {
//     agent any

//     environment {
//         SONAR_PROJECT_KEY = 'hrms'
//     }

//     stages {

//         stage('Checkout') {
//             steps {
//                 deleteDir()
//                 checkout scm
//             }
//         }

//         // stage('SonarQube Scan') {
//         //     steps {
//         //         withSonarQubeEnv('sonar-equest') {
//         //             sh '''
//         //                 docker run --rm \
//         //                   -v "$PWD:/usr/src" \
//         //                   -w /usr/src \
//         //                   sonarsource/sonar-scanner-cli \
//         //                   -Dsonar.projectKey=$SONAR_PROJECT_KEY \
//         //                   -Dsonar.sources=.
//         //             '''
//         //         }
//         //     }
//         // }

//         // stage('SonarQube Scan') {
//         //     steps {
//         //         withSonarQubeEnv('sonar-equest') {
//         //             sh '''
//         //                 docker run --rm \
//         //                 -v "$PWD:/usr/src" \
//         //                 -w /usr/src \
//         //                 sonarsource/sonar-scanner-cli \
//         //                 -Dsonar.projectKey=hrms-frontend \
//         //                 -Dsonar.host.url=https://sonar.equest.solutions \
//         //                 -Dsonar.token=$SONAR_TOKEN \
//         //                 -Dsonar.sources=.
//         //             '''
//         //         }
//         //     }
//         // }

//         stage('Debug Workspace') {
//             steps {
//                 sh 'pwd && ls -l'
//             }
//         } 

//         stage('Debug Container') {
//             steps {
//                 sh 'docker run --rm -v "$PWD:/usr/src" -w /usr/src alpine ls -l'
//             }
//         }



//         // stage('SonarQube Scan') {
//         //     steps {
//         //         withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
//         //             sh '''
//         //                 docker run --rm \
//         //                 -v /var/jenkins_home/workspace:/usr/src \
//         //                 -w /usr/src/HRMS-DEPOLY \
//         //                 -e SONAR_TOKEN=$SONAR_TOKEN \
//         //                 sonarsource/sonar-scanner-cli \
//         //                 -Dsonar.projectKey=hrms \
//         //                 -Dsonar.host.url=https://sonar.equest.solutions \
//         //                 -Dsonar.token=$SONAR_TOKEN \
//         //                 -Dsonar.sources=frontend-hrms,backend-hrms

//         //             '''
//         //         }
//         //     }
//         // }

//         stage('SonarQube Scan - Frontend') {
//             steps {
//                 withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
//                     sh '''
//                         docker run --rm \
//                         -v /var/jenkins_home/workspace/HRMS-DEPOLY:/usr/src \
//                         -w /usr/src/frontend-hrms \
//                         -e SONAR_TOKEN=$SONAR_TOKEN \
//                         sonarsource/sonar-scanner-cli \
//                         -Dsonar.projectKey=hrms-frontend \
//                         -Dsonar.host.url=https://sonar.equest.solutions \
//                         -Dsonar.token=$SONAR_TOKEN \
//                         -Dsonar.sources=.
//                     '''
//                 }
//             }
//         }

//         stage('SonarQube Scan - Backend') {
//             steps {
//                 withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
//                     sh '''
//                         docker run --rm \
//                         -v /var/jenkins_home/workspace/HRMS-DEPOLY:/usr/src \
//                         -w /usr/src/backend-hrms \
//                         -e SONAR_TOKEN=$SONAR_TOKEN \
//                         sonarsource/sonar-scanner-cli \
//                         -Dsonar.projectKey=hrms-backend \
//                         -Dsonar.host.url=https://sonar.equest.solutions \
//                         -Dsonar.token=$SONAR_TOKEN \
//                         -Dsonar.sources=.
//                     '''
//                 }
//             }
//         }


//         // stage('Debug Workspace') {
//         //     steps {
//         //         sh 'ls -R'
//         //     }
//         // }


//         // stage('Quality Gate') {
//         //     steps {
//         //         timeout(time: 5, unit: 'MINUTES') {
//         //             waitForQualityGate abortPipeline: true
//         //         }
//         //     }
//         // }

//         stage('Build') {
//             agent { label 'hrms' }
//             steps {
//                 dir('frontend-hrms') {
//                     sh '''
//                         sudo -u nodejs bash -c '
//                             export NVM_DIR=/home/nodejs/.nvm
//                             [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
//                             sudo rm -rf dist
//                             npm install --prefix /var/www/node-apps/hrms/frontend-hrms
//                             npm run build --prefix /var/www/node-apps/hrms/frontend-hrms
//                         '
//                     '''
//                 }
//             }
//         }

//         stage('Deploy') {
//             agent { label 'hrms' }
//             steps {
//                 sh '''
//                     sudo -u nodejs bash -c '
//                         export NVM_DIR=/home/nodejs/.nvm
//                         [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
//                         pm2 restart eq-hrms
//                     '
//                 '''
//             }
//         }
//     }
// }

pipeline {
    agent any

    environment {
        SONAR_HOST_URL   = 'https://sonar.equest.solutions'
        SONAR_PROJECT_KEY = 'hrms'
    }

    stages {

        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Debug Workspace') {
            steps {
                sh 'pwd && ls -l'
            }
        }

        stage('Debug Container') {
            steps {
                sh 'docker run --rm -v "$PWD:/usr/src" -w /usr/src alpine ls -l'
            }
        }

        // stage('SonarQube Scan - Frontend') {
        //     steps {
        //         withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
        //             sh '''
        //                 docker run --rm \
        //                   -v /var/jenkins_home/workspace/HRMS-DEPOLY:/usr/src \
        //                   -w /usr/src/frontend-hrms \
        //                   -e SONAR_TOKEN=$SONAR_TOKEN \
        //                   sonarsource/sonar-scanner-cli \
        //                   -Dsonar.projectKey=hrms-frontend \
        //                   -Dsonar.host.url=$SONAR_HOST_URL \
        //                   -Dsonar.token=$SONAR_TOKEN \
        //                   -Dsonar.sources=.
        //             '''
        //         }
        //     }
        // }

        // stage('SonarQube Scan - Backend') {
        //     steps {
        //         withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
        //             sh '''
        //                 docker run --rm \
        //                   -v /var/jenkins_home/workspace/HRMS-DEPOLY:/usr/src \
        //                   -w /usr/src/backend-hrms \
        //                   -e SONAR_TOKEN=$SONAR_TOKEN \
        //                   sonarsource/sonar-scanner-cli \
        //                   -Dsonar.projectKey=hrms-backend \
        //                   -Dsonar.host.url=$SONAR_HOST_URL \
        //                   -Dsonar.token=$SONAR_TOKEN \
        //                   -Dsonar.sources=.
        //             '''
        //         }
        //     }
        // }

        stage('SonarQube Scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm \
                        -v /var/jenkins_home/workspace/HRMS-DEPOLY:/usr/src \
                        -w /usr/src \
                        -e SONAR_TOKEN=$SONAR_TOKEN \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=hrms \
                        -Dsonar.host.url=https://sonar.equest.solutions \
                        -Dsonar.token=$SONAR_TOKEN 

                    '''
                }
            }
        }


        stage('Build') {
            agent { label 'hrms' }
            steps {
                dir('frontend-hrms') {
                    sh '''
                        sudo -u nodejs bash -c '
                            export NVM_DIR=/home/nodejs/.nvm
                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                            sudo rm -rf dist
                            npm install --prefix /var/www/node-apps/hrms/frontend-hrms
                            npm run build --prefix /var/www/node-apps/hrms/frontend-hrms
                        '
                    '''
                }
            }
        }

        stage('Deploy') {
            agent { label 'hrms' }
            steps {
                sh '''
                    sudo -u nodejs bash -c '
                        export NVM_DIR=/home/nodejs/.nvm
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        pm2 restart eq-hrms
                    '
                '''
            }
        }
    }
}

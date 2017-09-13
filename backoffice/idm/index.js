const { idmGraphQLFetch } = require('@learnersguild/idm-jwt-auth/lib/utils')

const ROBOT_HANDLES = ['echo-bot','lg-bot']

class IDMClient {
  constructor(lgJWT){
    this.lgJWT = lgJWT
  }

  query(query, variables={}){
    return idmGraphQLFetch({query, variables}, this.lgJWT)
  }

  getAllLearners(){
    return this.query(`
      query {
        findUsers {
          id
          active
          email
          emails
          handle
          profileUrl
          avatarUrl
          name
          phone
          dateOfBirth
          timezone
          roles
          createdAt
          updatedAt
        }
      }
    `)
    .then(response => response.data.findUsers)
    .then(users =>
      users.filter(user =>
        !ROBOT_HANDLES.includes(user.handle)
      )
    )
  }


  getActiveLearnersForPhase(phaseNumber){
    return this.getActiveLearners()
      .then(learners =>
        learners
          .filter(learner => learner.phase === phaseNumber)
      )
  }

  getLearnerByHandle(handle){
    return this.query(`
      query {
        findUsers(identifiers: [${JSON.stringify(handle)}]) {
          id
          active
          email
          emails
          handle
          profileUrl
          avatarUrl
          name
          phone
          dateOfBirth
          timezone
          roles
          createdAt
          updatedAt
        }
      }
    `)
    .then(response => response.data.findUsers[0])
  }
}

module.exports = { IDMClient }

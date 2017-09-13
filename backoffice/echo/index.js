const { idmGraphQLFetch } = require('@learnersguild/idm-jwt-auth/lib/utils')
const echoGraphQLFetch = require('./graphQLFetch')

class EchoClient {
  constructor(lgJWT){
    this.lgJWT = lgJWT
  }

  query(query, variables={}){
    return echoGraphQLFetch({query, variables}, this.lgJWT)
  }

  getPhasesForLearners(learners){
    const identifiers = JSON.stringify(learners.map(l => l.handle))
    return this.query(`
      query{
        findUsers(identifiers: ${identifiers}){
          handle
          phase {
            number
          }
        }
      }
    `).then(response => {
      response.data.findUsers.forEach(user => {
        const learner = learners.find(learner => learner.handle === user.handle)
        if (!learner) return
        if (user.phase) learner.phase = user.phase.number
      })
      return learners
    })
  }
}



module.exports = { EchoClient }

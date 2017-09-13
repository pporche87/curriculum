require('../environment')
const { idmGraphQLFetch } = require('@learnersguild/idm-jwt-auth/lib/utils')
const { IDMClient } = require('./idm')
const { EchoClient } = require('./echo')
const hubspot = require('./hubspot')

const ROBOT_HANDLES = ['echo-bot','lg-bot']

module.exports = class BackOffice {

  constructor(lgJWT){
    this.idm = new IDMClient(lgJWT)
    this.echo = new EchoClient(lgJWT)
    this.hubspot = hubspot
  }

  getAllLearners(){
    return this.idm
      .getAllLearners()
      .then(learners => this.getPhasesForLearners(learners))
  }

  getActiveLearners(){
    return this
      .getAllLearners()
      .then(filterForActiveLearners)
  }

  getLearnerByHandle(handle, options={}){
    options = Object.assign(
      // default options
      {
        includeHubspotData: true,
      },
      options
    )
    return this.idm
      .getLearnerByHandle(handle)
      .then(user => {
        if (!user) return user
        if (options.includeHubspotData) return getHubspotDataForUser(user)
        return user
      })
  }


  getPhasesForLearners(learners){
    return this.echo.getPhasesForLearners(learners)
  }

}


const filterForActiveLearners = getAllLearners =>
  getAllLearners.filter(learner => learner.active)



const getHubspotDataForUser = user =>
  hubspot.getContactByEmail(user.email).then(hubspotContact =>
    Object.assign(user, hubspotContact)
  )

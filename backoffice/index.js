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

  getAllUsers(options={}){
    options = Object.assign(
      // default options
      {
        includePhases: false,
      },
      options
    )

    return this.idm.getAllUsers()
      .then(learners => {
        if (options.includePhases) return this.getPhasesForLearners(learners)
        return learners
      })
  }

  getActiveUsers(){
    return this.getAllUsers().then(filterForActive)
  }

  getAllLearners(){
    return this.getAllUsers()
      .then(users =>
        users.filter(user =>
          user.roles.includes('learner') &&
          !user.roles.includes('staff')
        )
      )
  }

  getActiveLearners(){
    return this.getAllLearners().then(filterForActive)
  }

  getUserByHandle(handle, options={}){
    options = Object.assign(
      // default options
      {
        includeHubspotData: false,
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


const filterForActive = getAllLearners =>
  getAllLearners.filter(learner => learner.active)



const getHubspotDataForUser = user =>
  hubspot.getContactByEmail(user.email).then(hubspotContact =>
    Object.assign(user, hubspotContact)
  )

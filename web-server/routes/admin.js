module.exports = app => {

  app.use('/admin', app.ensureAdmin)

  app.get('/admin', (request, response) => {
    response.render('admin/index')
  })

  app.get('/admin/users', (request, response, next) => {
    request.backOffice.getAllUsers({
      includePhases: true,
      includeHubspotData: true,
    })
      .then(users => {
        response.render('admin/users/index', { users })
      })
      .catch(next)
  })

  app.get('/admin/users/:handle', (request, response, next) => {
    request.backOffice.getUserByHandle(
      request.params.handle,
      {
        includeHubspotData: true
      }
    )
      .then(targetUser => {
        response.render('admin/users/show', { targetUser })
      })
      .catch(next)

  })

}

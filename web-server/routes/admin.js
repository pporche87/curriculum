module.exports = app => {

  app.use('/admin', app.ensureAdmin)

  app.get('/admin', (request, response) => {
    response.render('admin/index')
  })

  app.get('/admin/users', (request, response, next) => {
    request.backOffice.getAllLearners()
      .then(users => {
        response.render('admin/users/index', { users })
      })
      .catch(next)
  })

  app.get('/admin/users/:handle', (request, response, next) => {
    request.backOffice.getLearnerByHandle(request.params.handle)
      .then(user => {
        response.render('admin/users/show', { user })
      })
      .catch(next)

  })

}

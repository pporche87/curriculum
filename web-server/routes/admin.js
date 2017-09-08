module.exports = app => {

  app.use('/admin', app.ensureAdmin)

  app.get('/admin', (request, response) => {
    response.render('admin/index')
  })

}

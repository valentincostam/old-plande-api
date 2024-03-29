/*
  Async Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

exports.asyncHandler = fn =>
  (req, res, next) =>
    fn(req, res, next)
      .catch(next);

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/

function removeDuplicateUsingFilter(arr){
  let unique_array = arr.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
  });
  return unique_array
}

exports.flashValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);

  const errorKeys = Object.keys(err.errors)
  const errorMessages = []
  
  errorKeys.forEach(key => errorMessages.push(err.errors[key].message))

  // Eliminar mensajes repetidos. Evita que se muestre múltiples veces el mismo error al usar compound indexes. 
  const noDuplicatesErrorMessages = errorMessages
    .filter((elem, index, self) => index == self.indexOf(elem))
  
  noDuplicatesErrorMessages.forEach(message => req.flash('error', message))

  res.redirect('back')
};

/*
  Development Error Hanlder

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails);
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
  });
};

/*
  Production Error Hanlder

  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};

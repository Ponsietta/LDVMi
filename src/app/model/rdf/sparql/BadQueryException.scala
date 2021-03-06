package model.rdf.sparql

class BadQueryException(cause: Exception, message: Option[String] = None) extends Exception {

  override def getMessage : String = {
    message.map { m => m + "\n" + cause.getMessage }.getOrElse("Cause message: "+ cause.getMessage)
  }

  override def getCause : Exception = {
    cause
  }

}

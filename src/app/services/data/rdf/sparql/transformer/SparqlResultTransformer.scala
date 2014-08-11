package services.data.rdf.sparql.transformer

import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.jena.JenaLang

trait SparqlResultTransformer[D <: JenaLang, R] {

  def transform(data: SparqlResult[D]) : R

  def getLang: D

}
from functools import reduce
from itertools import product
from typing import Generator

from utilidades import Pelicula, Genero


# ----------------------------------------------------------------------------
# Parte I: Cargar dataset
# ----------------------------------------------------------------------------

def cargar_peliculas(ruta: str) -> Generator:
    with open(ruta, 'r', encoding='utf-8') as archivo:
        next(archivo)
        
        for linea in archivo:
            datos = linea.strip().split(',')
            
            id_pelicula = int(datos[0])
            titulo = datos[1]
            director = datos[2]
            estreno = int(datos[3])
            rating = float(datos[4])
            
            pelicula = Pelicula(id_pelicula, titulo, director, estreno, rating)
            yield pelicula


# ----------------------------------------------------------------------------
# Parte II: Consultas sobre generadores
# ----------------------------------------------------------------------------


def obtener_directores(generador_peliculas: Generator) -> Generator:
    
    return map(lambda pelicula: pelicula.director, generador_peliculas)


def obtener_str_titulos(generador_peliculas: Generator) -> str:
    
    titulos = map(lambda pelicula: pelicula.titulo, generador_peliculas)
    return reduce(lambda acc, titulo: acc + ", " + titulo if acc else titulo, titulos, "")


def filtrar_peliculas(
    generador_peliculas: Generator,
    director: str | None = None,
    rating_min: float | None = None,
    rating_max: float | None = None,
) -> filter:
    
    def criterio_filtro(pelicula):
        if director is not None and pelicula.director != director:
            return False
        
        if rating_min is not None and pelicula.rating < rating_min:
            return False
        
        if rating_max is not None and pelicula.rating > rating_max:
            return False
        
        return True
    
    return filter(criterio_filtro, generador_peliculas)


def filtrar_titulos(
    generador_peliculas: Generator,
    director: str,
    rating_min: float,
    rating_max: float
) -> str:
 
    peliculas_filtradas = filtrar_peliculas(
        generador_peliculas, 
        director=director, 
        rating_min=rating_min, 
        rating_max=rating_max
    )
    
    return obtener_str_titulos(peliculas_filtradas)


def filtrar_peliculas_por_genero(
    generador_peliculas: Generator,
    generador_generos: Generator,
    genero: str | None = None,
) -> Generator:
  
    combinaciones = product(generador_peliculas, generador_generos)
    
    def mismo_id(par):
        pelicula, genero_obj = par
        return pelicula.id_pelicula == genero_obj.id_pelicula
    
    pares_mismo_id = filter(mismo_id, combinaciones)
    
    if genero is not None:
        def genero_coincide(par):
            pelicula, genero_obj = par
            return genero_obj.genero == genero
        
        return filter(genero_coincide, pares_mismo_id)
    
    return pares_mismo_id
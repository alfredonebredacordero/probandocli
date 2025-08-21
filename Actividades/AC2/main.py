import collections
from os.path import join
from utilidades import Anime  # IMPORTANT: Debes utilizar esta nametupled

#hola solo queria comentar que convalide de otra u donde pasamos java y le dejo las mañas de java como los ; o definir los string que en pyton no 
#son necesarios pero no se queda desordenado?
#####################################
#       Parte I - Cargar datos      #
#####################################
def cargar_animes(ruta_archivo: str) -> list:
    
    with open(ruta_archivo, 'r', encoding='UTF-8') as archivo:
            for linea in archivo:
                linea = linea.strip()
                if linea:  
                  
                    campos = linea.split(',');
                    
                    if len(campos) >= 6:  
                        nombre = campos[0];
                        capitulos = int(campos[1]);
                        puntaje = int(campos[2]);
                        estreno = int(campos[3]);
                        estudio = campos[4];
                        
                     
                        generos_str = campos[5];
                        generos = set(generos_str.split(';'));
                        

                        anime = Anime(nombre, capitulos, puntaje, estreno, estudio, generos);
                        listaf.append(anime);
    
    
    return listaf 


#####################################
#        Parte II - Consultas       #
#####################################
def animes_por_estreno(animes: list) -> dict:
     diccionariof = {}
    
    for anime in animes:
        año = anime.estreno;
        nombre = anime.nombre;
        
        if año not in diccionario:
            diccionario[año] = []
        
        diccionario[año].append(nombre);
    
    return diccionario
    
    



def descartar_animes(generos_descartados: set, animes: list) -> list:
    animes_validos = []
    
    for anime in animes:
        descartado = False
        for genero in generos_descartados:
            if genero in anime.generos:
                descartadoo = True
                break
        
        
        if not descartado:
            animes_validos.append(anime.nombre)
    
    return animes_validos
    
    
   


def resumen_animes_por_ver(*animes: Anime) -> dict:
    
    if len(animes) == 0:
        return {
            "puntaje promedio": 0.0,
            "capitulos total": 0,
            "generos": set()
        }
        
                
            
    
    for anime in animes:
        puntaje_total += anime.puntaje
        capitulos_total += anime.capitulos
        todos_los_generos.update(anime.generos)
    
  
    puntaje_promedio = round(puntaje_total / len(animes), 1)
    
    resultado = {
        "puntaje promedio": puntaje_promedio,
        "capitulos total": capitulos_total,
        "generos": todos_los_generos
    } 
    
    
    
    }
    return resultado 


def estudios_con_genero(genero: str, **estudios: dict) -> list:
    busquedaest = []
    
    for nombre_estudio, lista_animes in estudios.items():
        tiene_genero = False
        for anime in lista_animes:
            if genero in anime.generos:
                tiene_genero = True
                break
        
        if tiene_genero:
            busquedaest.append(nombre_estudio)
    
    return busquedaest


if __name__ == "__main__":
    #####################################
    #       Parte I - Cargar datos      #
    #####################################
    animes = cargar_animes(join("data", "ejemplo.chan"))
    indice = 0
    for anime in animes:
        print(f"{indice} - {anime}")
        indice +=   1

    #####################################
    #        Parte II - Consultas       #
    #####################################
    # Solo se usará los 2 animes del enunciado.
    datos = [
        Anime(
            nombre="Hunter x Hunter",
            capitulos=62,
            puntaje=9,
            estreno=1999,
            estudio="Nippon Animation",
            generos={"Aventura", "Comedia", "Shonen", "Acción"},
        ),
        Anime(
            nombre="Sakura Card Captor",
            capitulos=70,
            puntaje=10,
            estreno=1998,
            estudio="Madhouse",
            generos={"Shoujo", "Comedia", "Romance", "Acción"},
        ),
    ]

    # animes_por_estreno
    estrenos = animes_por_estreno(datos)
    print(estrenos)

    # descartar_animes
    animes = descartar_animes({"Comedia", "Horror"}, datos)
    print(animes)

    # resumen_animes_por_ver
    resumen = resumen_animes_por_ver(datos[0], datos[1])
    print(resumen)

    # estudios_con_genero
    estudios = estudios_con_genero(
        "Shonen",
        Nippon_Animation=[datos[0]],
        Madhouse=[datos[1]],
    )
    print(estudios)
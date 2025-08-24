import copy
from typing import Optional
import visualizador
# para esta tarea , decidi que todos los metodos terminan en true, y cortan en false cuando hay un error, para ordenarme, ns si es mejor o peor, si pueden dar algun comentario sobre eso bkn! 

class Tablero:
    def __init__(self) -> None:
        self.tablero = []  #lo defini como una lista de lista 
        self.movimientos = 0  # Cantidad de acciones aplicadas al tablero
        self.estado = False  # Bool que indica si el tablero está resuelto
        self.filas = 0  # Número de filas de casillas regulares
        self.columnas = 0  # Número de columnas de casillas regulares
        self.casillas_deshabilitadas = set()  # Set de tuplas (fila, columna) deshabilitadas
    
    def cargar_tablero(self, archivo: str) -> None:
        try:
            #abrir el archivo de config .t.
            with open(f"config/{archivo}", "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            # mapiar las columnas y filas
            self.filas, self.columnas = map(int, lines[0].strip().split())
            
            # Inicializar tablero con dimensiones   N+1, (la parte de la suma)
            self.tablero = []
            self.casillas_deshabilitadas = set()  # Resetear casillas deshabilitadas
            
            # Leer N+1 líneas del tablero
            for i in range(1, self.filas + 2):  # N+1 líneas
                fila = lines[i].strip().split()
                fila_procesada = []
                
                for j, valor in enumerate(fila):
                    if valor == '.':
                        fila_procesada.append('.')
                    elif valor.startswith('X'):
                        # Mantener las x o casillas desavilitaas 
                        fila_procesada.append(valor)
                        if i-1 < self.filas and j < self.columnas:  # Solo casillas regulares
                            self.casillas_deshabilitadas.add((i-1, j))
                    else:
                        fila_procesada.append(valor)
                
                self.tablero.append(fila_procesada)
            
            # Resetear estado de movimientos y si esta resuelto
            self.movimientos = 0
            self.estado = False
            
        except (FileNotFoundError, ValueError, IndexError) as e:
            print(f"Error cargando tablero: {e}")
    
    def mostrar_tablero(self) -> None:
        
        # guardar el tablero en otra parte para mostrar
        tablero_display = []
        
        for i in range(len(self.tablero)):
            fila_display = []
            for j in range(len(self.tablero[i])):
                valor = self.tablero[i][j]
                
                # si es una casilla regular deshabilitada mostrar como algo 2.- Creo que aca va un X, segun la pauta pero hacia adelante ocupe esto... dou 3.- me enrede entre los x y los vacios con vacios funciona hasta ahora
                if i < self.filas and j < self.columnas and (i, j) in self.casillas_deshabilitadas:
                
                    fila_display.append('.')
                else:
                    fila_display.append(str(valor))
            
            tablero_display.append(fila_display)
        
        visualizador.imprimir_tablero(tablero_display)
    
    def modificar_casilla(self, fila: int, columna: int) -> bool:
        
        # la mayoria de los test fue revisar que revisara cosas, aca reviso si son int :D
        try:
            fila = int(fila)
            columna = int(columna)
        except (ValueError, TypeError):
            print("Error: Las coordenadas deben ser números enteros")
            return False
        
        # y aca revisar que sean cordenadas que existen
        if not (0 <= fila < self.filas and 0 <= columna < self.columnas):
            print(f"Error: Coordenadas inválidas. Fila debe estar entre 0-{self.filas-1}, columna entre 0-{self.columnas-1}")
            return False
        
        # mirar que la casilla exista 
        valor_actual = self.tablero[fila][columna]
        
        # si es x que sea vacia 
        if isinstance(valor_actual, str) and valor_actual.startswith('X'):
            valor_original = valor_actual[1:]
        else:
            valor_original = str(valor_actual)
        
        if valor_original == '.':
            print("Error: No se puede modificar una casilla vacía")
            return False
        
        # cambiar estado de la casilla
        if (fila, columna) in self.casillas_deshabilitadas:
            #poder cambiar las x a vacios 
            self.casillas_deshabilitadas.remove((fila, columna))
            self.tablero[fila][columna] = valor_original
            print(f"Casilla ({fila}, {columna}) habilitada")
        else:
            # de vacios a X
            self.casillas_deshabilitadas.add((fila, columna))
            self.tablero[fila][columna] = f"X{valor_original}"
            print(f"Casilla ({fila}, {columna}) deshabilitada")
        
        self.movimientos += 1
        
        # actualizar 
        self.validar()
        
        return True
    
    def validar(self) -> bool:
        
        # revisar que existe 
        if not self.tablero:
            self.estado = False
            return False
        
        # algunos test case me soltaban error, porque como que no tenian dimensiones :( 
        if self.filas == 0 or self.columnas == 0:
            # tablero de n+1 y m+1
            filas_actuales = len(self.tablero) - 1
            columnas_actuales = len(self.tablero[0]) - 1 if self.tablero else 0
        else:
            filas_actuales = self.filas
            columnas_actuales = self.columnas
        
        # Si las dimensiones son inválidas, retornar False
        if filas_actuales <= 0 or columnas_actuales <= 0:
            self.estado = False
            return False
        
        es_valido = True
        
        # Verificar filas
        for i in range(filas_actuales):
            if i >= len(self.tablero) or columnas_actuales >= len(self.tablero[i]):
                es_valido = False
                break
                
            objetivo_fila = self.tablero[i][columnas_actuales]  # Última columna de la fila
            
            if objetivo_fila != '.':
                try:
                    suma_fila = 0
                    objetivo_valor = int(objetivo_fila)
                    
                    for j in range(columnas_actuales):
                        if j >= len(self.tablero[i]):
                            continue
                            
                        valor_celda = self.tablero[i][j]
                        
                        # Solo sumar casillas que tienen número Y están habilitadas
                        if valor_celda != '.' and (i, j) not in self.casillas_deshabilitadas:
                            # Si tiene X, extraer el número
                            if isinstance(valor_celda, str) and valor_celda.startswith('X'):
                                numero = int(valor_celda[1:])
                            else:
                                numero = int(valor_celda)
                            suma_fila += numero
                    
                    if suma_fila != objetivo_valor:
                        es_valido = False
                        break
                except (ValueError, IndexError):
                    es_valido = False
                    break
        
        # Solo verificar columnas si las filas están correctas
        if es_valido and filas_actuales < len(self.tablero):
            for j in range(columnas_actuales):
                if j >= len(self.tablero[filas_actuales]):
                    continue
                    
                objetivo_columna = self.tablero[filas_actuales][j]  # Última fila de la columna
                
                if objetivo_columna != '.':
                    try:
                        suma_columna = 0
                        objetivo_valor = int(objetivo_columna)
                        
                        for i in range(filas_actuales):
                            if i >= len(self.tablero) or j >= len(self.tablero[i]):
                                continue
                                
                            valor_celda = self.tablero[i][j]
                            
                            # Solo sumar casillas que tienen número Y están habilitadas
                            if valor_celda != '.' and (i, j) not in self.casillas_deshabilitadas:
                                # Si tiene X, extraer el número
                                if isinstance(valor_celda, str) and valor_celda.startswith('X'):
                                    numero = int(valor_celda[1:])
                                else:
                                    numero = int(valor_celda)
                                suma_columna += numero
                        
                        if suma_columna != objetivo_valor:
                            es_valido = False
                            break
                    except (ValueError, IndexError):
                        es_valido = False
                        break
        
        self.estado = es_valido
        return es_valido
    
    def encontrar_solucion(self) -> Optional['Tablero']:
        
        if self.validar():
            # es solucion
            return self._copiar_tablero()
        
        # Obtener todas las casillas regulares que contienen números
        casillas_disponibles = []
        for i in range(self.filas):
            for j in range(self.columnas):
                valor_celda = self.tablero[i][j]
                # Incluir casillas que tienen números (incluso si empiezan con X)
                if valor_celda != '.':
                    if isinstance(valor_celda, str) and valor_celda.startswith('X'):
                        # Ya está deshabilitada, pero incluir en las opciones
                        casillas_disponibles.append((i, j))
                    elif valor_celda != '.':
                        casillas_disponibles.append((i, j))
        
        # esto lo puse mas adelante lo saque de aca https://www.geeksforgeeks.org/dsa/backtracking-algorithm-in-python/
        solucion = self._backtrack(casillas_disponibles, 0, set(self.casillas_deshabilitadas))
        
        if solucion is not None:
            tablero_solucion = self._copiar_tablero()
            tablero_solucion.casillas_deshabilitadas = solucion
            
            # Actualizar la estructura del tablero para reflejar las casillas deshabilitadas
            for i in range(tablero_solucion.filas):
                for j in range(tablero_solucion.columnas):
                    valor_actual = tablero_solucion.tablero[i][j]
                    
                    if valor_actual != '.':
                        # Obtener el valor original (sin X si la tiene)
                        if isinstance(valor_actual, str) and valor_actual.startswith('X'):
                            valor_original = valor_actual[1:]
                        else:
                            valor_original = str(valor_actual)
                        
                        # Actualizar según el estado de deshabilitación
                        if (i, j) in solucion:
                            # Deshabilitar: agregar X
                            tablero_solucion.tablero[i][j] = f"X{valor_original}"
                        else:
                            # Habilitar: quitar X si la tiene
                            tablero_solucion.tablero[i][j] = valor_original
            
            tablero_solucion.validar()  # Actualizar estado
            return tablero_solucion
        
        return None
    
    def _backtrack(self, casillas: list, indice: int, deshabilitadas: set) -> Optional[set]:
        #busque como hacer sudoku solvers q me parecian lo mas parecido y llegue a este, adapte el codigo de aca https://www.geeksforgeeks.org/dsa/backtracking-algorithm-in-python/ 
        if indice == len(casillas):
            # Probar configuración actual
            if self._validar_configuracion(deshabilitadas):
                return deshabilitadas.copy()
            return None
        
        fila, columna = casillas[indice]
        
        # Probar con casilla habilitada
        resultado = self._backtrack(casillas, indice + 1, deshabilitadas)
        if resultado is not None:
            return resultado
        
        # Probar con casilla deshabilitada
        deshabilitadas.add((fila, columna))
        resultado = self._backtrack(casillas, indice + 1, deshabilitadas)
        if resultado is not None:
            return resultado
        
        # Backtrack: quitar de deshabilitadas
        deshabilitadas.remove((fila, columna))
        return None
    # hasta aca es todo codigo de ahi 
    def _validar_configuracion(self, deshabilitadas: set) -> bool:
        
        # usar las dimensiones correctas
        filas_validar = self.filas if self.filas > 0 else len(self.tablero) - 1
        columnas_validar = self.columnas if self.columnas > 0 else len(self.tablero[0]) - 1
        
        # revisar las filas
        for i in range(filas_validar):
            if i >= len(self.tablero) or columnas_validar >= len(self.tablero[i]):
                continue
                
            objetivo_fila = self.tablero[i][columnas_validar]
            
            if objetivo_fila != '.':
                try:
                    suma_fila = 0
                    objetivo_valor = int(objetivo_fila)
                    
                    for j in range(columnas_validar):
                        if j >= len(self.tablero[i]):
                            continue
                            
                        valor_celda = self.tablero[i][j]
                        
                        if valor_celda != '.' and (i, j) not in deshabilitadas:
                            # si tiene x no contarlo
                            if isinstance(valor_celda, str) and valor_celda.startswith('X'):
                                numero = int(valor_celda[1:])
                            else:
                                numero = int(valor_celda)
                            suma_fila += numero
                    
                    if suma_fila != objetivo_valor:
                        return False
                except (ValueError, IndexError):
                    return False
        
        # lo mismo pero con las col, ns si se podia hacer junto ambas partes 
        if filas_validar < len(self.tablero):
            for j in range(columnas_validar):
                if j >= len(self.tablero[filas_validar]):
                    continue
                    
                objetivo_columna = self.tablero[filas_validar][j]
                
                if objetivo_columna != '.':
                    try:
                        suma_columna = 0
                        objetivo_valor = int(objetivo_columna)
                            
                        for i in range(filas_validar):
                            if i >= len(self.tablero) or j >= len(self.tablero[i]):
                                continue
                                
                            valor_celda = self.tablero[i][j]
                            
                            if valor_celda != '.' and (i, j) not in deshabilitadas:
                                # si tiene x no contar 
                                if isinstance(valor_celda, str) and valor_celda.startswith('X'):
                                    numero = int(valor_celda[1:])
                                else:
                                    numero = int(valor_celda)
                                suma_columna += numero
                        
                        if suma_columna != objetivo_valor:
                            return False
                    except (ValueError, IndexError):
                        return False
        
        return True
    
    def _copiar_tablero(self) -> 'Tablero':
       
        nuevo_tablero = Tablero()
        nuevo_tablero.tablero = copy.deepcopy(self.tablero)
        nuevo_tablero.movimientos = self.movimientos
        nuevo_tablero.estado = self.estado
        nuevo_tablero.filas = self.filas
        nuevo_tablero.columnas = self.columnas
        nuevo_tablero.casillas_deshabilitadas = self.casillas_deshabilitadas.copy()
        return nuevo_tablero
import os
from typing import Optional, List
from tablero import Tablero


class DCCasillas:
    def __init__(self, usuario: str, config: str) -> None:
        
        #un test case me soltaba error porque tenia un usuario vacio 
        self.usuario = usuario.strip() if usuario else ""
        self.puntaje = 0
        self.tablero_actual = None
        self.tableros = []
        
        # cargar el tablero desde config 
        self._cargar_configuracion(config)
    
    def _cargar_configuracion(self, config: str) -> None:
        
        try:
            config_path = f"config/{config}"
            if not os.path.exists(config_path):
                print(f"Error: No se encuentra el archivo de configuracion {config_path}")
                self.tableros = []
                return
                
            with open(config_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            if not lines:
                print("Error: Archivo de configuracion vacio")
                self.tableros = []
                return
                
            #leer cuantos tableros son
            num_tableros = int(lines[0].strip())
            
            if len(lines) < num_tableros + 1:
                print("Error: Archivo de configuracion incompleto")
                self.tableros = []
                return
            
            # con la cantidad de tableros guardar cada 1
            self.tableros = []
            for i in range(1, num_tableros + 1):
                nombre_archivo = lines[i].strip()
                tablero = Tablero()
                
                # mirar que el archivo que la config llama exista, me tiro error un test case 
                tablero_path = f"config/{nombre_archivo}"
                if not os.path.exists(tablero_path):
                    print(f"Error: No se encuentra el archivo de tablero {tablero_path}")
                    continue
                    
                tablero.cargar_tablero(nombre_archivo)
                
                # si no se carga tirar fail
                if tablero.filas > 0 and tablero.columnas > 0 and tablero.tablero:
                    self.tableros.append(tablero)
                else:
                    print(f"Error: No se pudo cargar correctamente el tablero {nombre_archivo}")
                    
        except (FileNotFoundError, ValueError, IndexError) as e:
            print(f"Error cargando configuracion: {e}")
            self.tableros = []
    
    def abrir_tablero(self, num_tablero: int) -> None:
        #deja abrir el tablero al num
        if 0 <= num_tablero < len(self.tableros):
            self.tablero_actual = num_tablero
        else:
            raise IndexError("Numero de tableros invalido!")
    
    def guardar_estado(self) -> bool:
        
        # si no hay usuario no guardar 
        if not self.usuario or self.usuario.strip() == "":
            print("Error: No se puede guardar el estado sin un nombre de usuario valido")
            return False
        
        
        if not self.tableros:
            print("Error: No hay tableros para guardar")
            return False
        
        try:
            # crear data, para guardar 
            os.makedirs("data", exist_ok=True)
            
            filename = f"data/{self.usuario}.txt"
            
            with open(filename, "w", encoding="utf-8") as f:
                # cantidad de tableros
                f.write(f"{len(self.tableros)}\n")
                
                # guardar por cada tablero la data 
                for tablero in self.tableros:
                    # movimientos 
                    f.write(f"{tablero.movimientos}\n")
                    
                    # dimensiones de este tablero 
                    f.write(f"{tablero.filas} {tablero.columnas}\n")
                    
                    # config de talbero 
                    for i in range(tablero.filas + 1):  # n+1 fil 
                        fila_str = []
                        for j in range(tablero.columnas + 1):  # m+1 col 
                            if i < len(tablero.tablero) and j < len(tablero.tablero[i]):
                                valor = tablero.tablero[i][j]
                                
                                # revisar q las desabilitadas tengan x, me tiraba error un x 
                                if (i < tablero.filas and j < tablero.columnas and 
                                    (i, j) in tablero.casillas_deshabilitadas):
                                    # si no tiene X, agregarla
                                    if not (isinstance(valor, str) and valor.startswith('X')):
                                        fila_str.append(f"X{valor}")
                                    else:
                                        fila_str.append(str(valor))
                                else:
                                    # si tiene x pero no esta desabiltada sacar la x 
                                    if isinstance(valor, str) and valor.startswith('X'):
                                        fila_str.append(valor[1:])  
                                    else:
                                        fila_str.append(str(valor))
                            else:
                                fila_str.append('.')
                        
                        f.write(" ".join(fila_str) + "\n")
            
            return True
            
        except Exception as e:
            print(f"Error guardando estado: {e}")
            return False
    
    def recuperar_estado(self) -> bool:
        
        
        if not self.usuario or self.usuario.strip() == "":
            print("Error: No se puede recuperar el estado sin un nombre de usuario valido")
            return False
            
        try:
            filename = f"data/{self.usuario}.txt"
            
            with open(filename, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            if not lines:
                print("Error: Archivo de estado vaci­o")
                return False
            
            
            num_tableros = int(lines[0].strip())
            
            
            if num_tableros < 0:
                print("Error: Numero de tableros no puede ser negativo")
                return False
            
            nuevos_tableros = []
            line_index = 1
            
            # Procesar cada tablero
            for _ in range(num_tableros):
                tablero = Tablero()
                
                # verificar
                if line_index >= len(lines):
                    print("Error: Archivo de estado incompleto")
                    return False
                
                # leer cantidad mov 
                movimientos = int(lines[line_index].strip())
                if movimientos < 0:
                    print("Error: Los movimientos no pueden ser negativos")
                    return False
                tablero.movimientos = movimientos
                line_index += 1
                
                
                if line_index >= len(lines):
                    print("Error: Archivo de estado incompleto")
                    return False
                
                # Leer dimensiones
                dimensiones = lines[line_index].strip().split()
                if len(dimensiones) != 2:
                    print("Error: Formato de dimensiones invalido")
                    return False
                
                filas, columnas = map(int, dimensiones)
                if filas < 0 or columnas < 0:
                    print("Error: Las dimensiones no pueden ser negativas")
                    return False
                if filas == 0 or columnas == 0:
                    print("Error: Las dimensiones deben ser mayor que cero")
                    return False
                
                tablero.filas = filas
                tablero.columnas = columnas
                line_index += 1
                
                # leer config 
                tablero.tablero = []
                tablero.casillas_deshabilitadas = set()
                
                
                if line_index + tablero.filas + 1 > len(lines):
                    print("Error: Archivo de estado incompleto , faltan lineas del tablero")
                    return False
                
                
                for i in range(tablero.filas + 1):
                    if line_index >= len(lines):
                        print("error: Archivo de estado incompleto")
                        return False
                        
                    fila = lines[line_index].strip().split()
                    line_index += 1
                    
                    # Verificar que la fila tiene el numero correcto de columnas
                    if len(fila) != tablero.columnas + 1:
                        print(f"Error: Fila {i} tiene {len(fila)} columnas, esperadas {tablero.columnas + 1}")
                        return False
                    
                    fila_procesada = []
                    for j, valor in enumerate(fila):
                        if valor == '.':
                            fila_procesada.append('.')
                        elif valor.startswith('X'):
                            # casilla desabilitada
                            numero_str = valor[1:]  # Quitar la X
                            if numero_str == '':
                                print("Error: Casilla con X pero sin numero")
                                return False
                            
                            try:
                                numero = int(numero_str)
                                if numero < 0:
                                    print("Error: Los numeros no pueden ser negativos")
                                    return False
                            except ValueError:
                                print(f"Error: Valor invalido despues de X: {numero_str}")
                                return False
                            
                            fila_procesada.append(valor)  # Mantener la X en el tablero
                            if i < tablero.filas and j < tablero.columnas:
                                tablero.casillas_deshabilitadas.add((i, j))
                        else:
                            # revisar que sea valido otro test case 
                            try:
                                numero = int(valor)
                                if numero < 0:
                                    print("Error: Los numeros no pueden ser negativos")
                                    return False
                            except ValueError:
                                print(f"Error: Valor invalido en tablero: {valor}")
                                return False
                            
                            fila_procesada.append(valor)
                    
                    tablero.tablero.append(fila_procesada)
                
                # Validar estado del tablero
                tablero.validar()
                nuevos_tableros.append(tablero)
            
            # Actualizar tableros
            self.tableros = nuevos_tableros
            
            # puntaje total
            self.puntaje = sum(tablero.movimientos for tablero in self.tableros if tablero.estado)
            
            return True
            
        except (FileNotFoundError, ValueError, IndexError) as e:
            print(f"Error recuperando estado: {e}")
            return False
    
    def obtener_tablero_actual(self) -> Optional[Tablero]:
        
        if self.tablero_actual is not None and 0 <= self.tablero_actual < len(self.tableros):
            return self.tableros[self.tablero_actual]
        return None
    
    def contar_tableros_resueltos(self) -> int:
        
        return sum(1 for tablero in self.tableros if tablero.estado)
    
    def actualizar_puntaje(self) -> None:
        
        self.puntaje = sum(tablero.movimientos for tablero in self.tableros if tablero.estado)
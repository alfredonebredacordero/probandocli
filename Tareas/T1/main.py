import os
import glob #esto lo ocupe para poder abrir todas las config lo saque de aca https://stackoverflow.com/questions/26810451/trying-to-use-glob-to-iterate-through-files-in-a-folder-in-python
from typing import Optional, List
from dccasillas import DCCasillas
from tablero import Tablero


class MenuJuego:
    def __init__(self):
        self.usuario: Optional[str] = None
        self.juego: Optional[DCCasillas] = None
        self.data_folder = "data"
        self.config_folder = "config"
        
        if not os.path.exists(self.data_folder):
            os.makedirs(self.data_folder)
    
    def obtener_configuraciones_disponibles(self) -> List[str]:
        
        if not os.path.exists(self.config_folder):
            return []
        
        # Buscar archivos que coincidan con patrones comunes, segun lo que dieron en el config, tenia duda si habia que consultar asi q lo agrege, ns si puede leer otros config 
        patrones = [
            "config*.txt",      # config, config01, config02, etc.
            "configuracion*.txt" # configuracion1, configuracion2, etc.
        ]
        
        archivos_config = []
        for patron in patrones:
            ruta_patron = os.path.join(self.config_folder, patron)
            archivos_config.extend(glob.glob(ruta_patron))
        
        # Extraer solo los nombres de archivo (sin la ruta)
        nombres_config = [os.path.basename(archivo) for archivo in archivos_config]
        
        # Ordenar los archivos
        nombres_config.sort()
        
        return nombres_config
    
    def mostrar_configuraciones_disponibles(self) -> Optional[str]:
        
        configuraciones = self.obtener_configuraciones_disponibles()
        
        if not configuraciones:
            print("No se encontraron archivos de configuración en la carpeta config/")
            return None
        
        print("\nArchivos de configuración disponibles:")
        for i, config in enumerate(configuraciones, 1):
            print(f"[{i}] {config}")
        
        while True:
            try:
                opcion = input(f"\nSeleccione una configuración (1-{len(configuraciones)}): ").strip()
                indice = int(opcion) - 1
                
                if 0 <= indice < len(configuraciones):
                    return configuraciones[indice]
                else:
                    print(f"Por favor ingrese un número entre 1 y {len(configuraciones)}")
            except ValueError:
                print("Por favor ingrese un número válido")
    
    def mostrar_menu(self):
        print("\n¡Bienvenido a DCCasillas!")
        
        # menu principal 
        if self.usuario and self.juego:
            usuario_display = self.usuario
            puntaje_display = self.juego.puntaje
            tableros_resueltos = self.juego.contar_tableros_resueltos()
            total_tableros = len(self.juego.tableros)
            tableros_display = f"{tableros_resueltos} de {total_tableros}"
        else:
            usuario_display = "UUU"
            puntaje_display = "PPP"
            tableros_display = "XXX de YYY"
        
        print(f"Usuario: {usuario_display}, Puntaje: {puntaje_display}")
        print(f"Tableros resueltos: {tableros_display}")
        
        print("\n*** Menú de Juego ***")
        print("[1] Iniciar juego nuevo")
        print("[2] Continuar juego")
        print("[3] Guardar estado de juego")
        print("[4] Recuperar estado de juego")
        print("[5] Salir del programa")
    
    def ejecutar_menu(self):
        while True:
            self.mostrar_menu()
            opcion = input("\nIndique su opción (1, 2, 3, 4, 5): ").strip()
            
            if opcion == "1":
                self.iniciar_juego_nuevo()
            elif opcion == "2":
                self.continuar_juego()
            elif opcion == "3":
                self.guardar_estado()
            elif opcion == "4":
                self.recuperar_estado()
            elif opcion == "5":
                self.salir_programa()
                break
            else:
                print("Opción inválida. Por favor seleccione una opción válida.")
    
    def iniciar_juego_nuevo(self):
        # Manejar usuario
        if self.usuario:
            cambiar = input(f"Usuario actual: {self.usuario}. ¿Desea cambiarlo? (s/n): ").strip().lower()
            if cambiar == 's':
                self.usuario = None
        
        if not self.usuario:
            while True:
                nombre = input("Ingrese su nombre de usuario: ").strip()
                if nombre:
                    self.usuario = nombre
                    break
                print("El nombre de usuario no puede estar vacío.")
        
        # selec config 
        archivo_config = self.mostrar_configuraciones_disponibles()
        if not archivo_config:
            print("No se puede iniciar el juego sin una configuración válida.")
            return
        
        # intentar crear nuevo juego con la configuración seleccionada
        try:
            print(f"\nCargando configuración: {archivo_config}")
            self.juego = DCCasillas(self.usuario, archivo_config)
            if self.juego.tableros:
                print(f"\n¡Nuevo juego iniciado para {self.usuario}!")
                print(f"Configuración: {archivo_config}")
                print(f"Se han cargado {len(self.juego.tableros)} tableros.")
                self.juego.abrir_tablero(0)  # abrir tablero 0 como actual
                self.ir_al_menu_acciones()
            else:
                print("Error: No se pudo cargar la configuración de tableros.")
                self.juego = None
        except Exception as e:
            print(f"Error: No se pudo cargar la configuración de tableros. {e}")
            self.juego = None
    
    def continuar_juego(self):
        if not self.usuario or not self.juego:
            print("Error: No hay un usuario definido.")
            return
        
        print(f"Tablero actual: {self.juego.tablero_actual}")
        opcion = input("¿Desea cambiar de tablero? (s/n): ").strip().lower()
        
        if opcion == 's':
            try:
                total_tableros = len(self.juego.tableros)
                nuevo_tablero = int(input(f"Ingrese número de tablero (0-{total_tableros-1}): "))
                if 0 <= nuevo_tablero < total_tableros:
                    self.juego.abrir_tablero(nuevo_tablero)
                    print(f"Cambiando al tablero {nuevo_tablero}")
                else:
                    print("Número de tablero inválido.")
                    return
            except ValueError:
                print("Debe ingresar un número válido.")
                return
        
        self.ir_al_menu_acciones()
    
    def guardar_estado(self):
        if not self.usuario or not self.juego:
            print("Error: No hay un usuario definido para guardar el estado.")
            return
        
        print(f"Guardando estado del juego para {self.usuario}...")
        if self.juego.guardar_estado():
            print("Estado guardado exitosamente.")
        else:
            print("Error al guardar el estado.")
    
    def recuperar_estado(self):
        if not self.usuario:
            print("Error: No hay un usuario definido para recuperar el estado.")
            return
        
        print(f"Recuperando estado del juego para {self.usuario}...")
        
        # Para recuperar estado necesitamos config 
        # o la primera disponible
        configuraciones = self.obtener_configuraciones_disponibles()
        if not configuraciones:
            print("Error: No se encontraron archivos de configuración.")
            return
        
        
        config_base = configuraciones[0]
        
        try:
            temp_juego = DCCasillas(self.usuario, config_base)
            if temp_juego.recuperar_estado():
                self.juego = temp_juego
                print("Estado recuperado exitosamente.")
            else:
                print("Error al recuperar el estado.")
        except Exception as e:
            print(f"Error al recuperar el estado: {e}")
    
    def salir_programa(self):
        print("¡Gracias por jugar DCCasillas!")
    
    def ir_al_menu_acciones(self):
        menu_acciones = MenuAcciones(self.juego)
        menu_acciones.ejecutar_menu()


class MenuAcciones:
    def __init__(self, juego: DCCasillas):
        self.juego = juego
    
    def mostrar_menu(self):
        print("\nDCCasillas")
        print(f"Usuario: {self.juego.usuario}, Puntaje: {self.juego.puntaje}")
        
        if self.juego.tablero_actual is not None:
            tablero_num = self.juego.tablero_actual + 1  # Mostrar base 1
            total_tableros = len(self.juego.tableros)
            tablero_actual = self.juego.obtener_tablero_actual()
            movimientos = tablero_actual.movimientos if tablero_actual else 0
            
            print(f"Número de tablero: {tablero_num} de {total_tableros}")
            print(f"Movimientos tablero: {movimientos}")
        
        print("\n*** Menú de Acciones ***")
        print("[1] Mostrar tablero")
        print("[2] Habilitar/deshabilitar casillas")
        print("[3] Verificar solución")
        print("[4] Encontrar solución")
        print("[5] Volver al menú de Juego")
    
    def ejecutar_menu(self):
        while True:
            self.mostrar_menu()
            opcion = input("\nIndique su opción (1, 2, 3, 4, 5): ").strip()
            
            if opcion == "1":
                self.mostrar_tablero()
            elif opcion == "2":
                self.modificar_casilla()
            elif opcion == "3":
                self.verificar_solucion()
            elif opcion == "4":
                self.encontrar_solucion()
            elif opcion == "5":
                break
            else:
                print("Opción inválida. Por favor seleccione una opción válida.")
    
    def mostrar_tablero(self):
        tablero = self.juego.obtener_tablero_actual()
        if tablero:
            tablero.mostrar_tablero()
        else:
            print("Error: No hay tablero actual seleccionado.")
    
    def modificar_casilla(self):
        tablero = self.juego.obtener_tablero_actual()
        if not tablero:
            print("Error: No hay tablero actual seleccionado.")
            return
        
        try:
            print(f"\nTablero actual tiene {tablero.filas} filas y {tablero.columnas} columnas")
            print("Coordenadas válidas: fila (0 a {}), columna (0 a {})".format(
                tablero.filas - 1, tablero.columnas - 1))
            
            fila = int(input("Ingrese número de fila: "))
            columna = int(input("Ingrese número de columna: "))
            
            if tablero.modificar_casilla(fila, columna):
                print("\nTablero actualizado:")
                tablero.mostrar_tablero()
                
                # Actualizar puntaje del juego
                self.juego.actualizar_puntaje()
            else:
                print("Error: No se pudo modificar la casilla.")
        
        except ValueError:
            print("Error: Debe ingresar números válidos para las coordenadas.")
    
    def verificar_solucion(self):
        tablero = self.juego.obtener_tablero_actual()
        if not tablero:
            print("Error: No hay tablero actual seleccionado.")
            return
        
        if tablero.validar():
            print("¡Felicitaciones! El tablero está resuelto correctamente.")
            print(f"Puntaje obtenido: {tablero.movimientos} puntos")
            
            # Actualizar puntaje del juego
            self.juego.actualizar_puntaje()
            tablero_actual_num = self.juego.tablero_actual
            total_tableros = len(self.juego.tableros)

            if tablero_actual_num + 1 < total_tableros:
                siguiente_tablero = tablero_actual_num + 1
                self.juego.abrir_tablero(siguiente_tablero)
                print(f"¡Avanzando al tablero {siguiente_tablero + 1}!")
            else:
                    print("¡Felicitaciones! Has completado todos los tableros disponibles.")
        else:
            print("El tablero no está resuelto correctamente.") 
            # mosttrar el error 
            print("\nEstado actual del tablero:")
            tablero.mostrar_tablero()
            self._mostrar_sumas_actuales(tablero)
    
    def _mostrar_sumas_actuales(self, tablero):
        
        print("\nSumas actuales vs objetivos:")
        
        # Mostrar sumas de filas
        for i in range(tablero.filas):
            objetivo = tablero.tablero[i][tablero.columnas]
            if objetivo != '.':
                suma_actual = 0
                for j in range(tablero.columnas):
                    if (tablero.tablero[i][j] != '.' and 
                        (i, j) not in tablero.casillas_deshabilitadas):
                        suma_actual += int(tablero.tablero[i][j])
                
                print(f"Fila {i}: suma={suma_actual}, objetivo={objetivo}")
        
        #  sumas de columnas
        for j in range(tablero.columnas):
            objetivo = tablero.tablero[tablero.filas][j]
            if objetivo != '.':
                suma_actual = 0
                for i in range(tablero.filas):
                    if (tablero.tablero[i][j] != '.' and 
                        (i, j) not in tablero.casillas_deshabilitadas):
                        suma_actual += int(tablero.tablero[i][j])
                
                print(f"Columna {j}: suma={suma_actual}, objetivo={objetivo}")
    
    def encontrar_solucion(self):
        tablero = self.juego.obtener_tablero_actual()
        if not tablero:
            print("Error: No hay tablero actual seleccionado.")
            return
        
        print("Buscando solución...")
        solucion = tablero.encontrar_solucion()
        
        if solucion:
            print("¡Solución encontrada!")
            solucion.mostrar_tablero()
            
            # agregar puntos de penalizacion
            puntos_solucion = tablero.filas * tablero.columnas
            self.juego.puntaje += puntos_solucion
            print(f"Se han agregado {puntos_solucion} puntos a tu puntaje por encontrar la solución automáticamente.")
        else:
            print("No se encontró solución para este tablero.") 
            #ns q deberia hacer si no hay solucion pasar a la siguiente ??? 
            tablero_actual_num = self.juego.tablero_actual
            total_tableros = len(self.juego.tableros)

            if tablero_actual_num + 1 < total_tableros:
                siguiente_tablero = tablero_actual_num + 1
                self.juego.abrir_tablero(siguiente_tablero)
                print(f"¡Avanzando al tablero {siguiente_tablero + 1}!")
            else:
                print("¡Felicitaciones! Has completado todos los tableros disponibles.")
                #recicle este codigo de avanzar un tablero pero ns si funcione 


if __name__ == "__main__":
    menu = MenuJuego()
    menu.ejecutar_menu()

=======
 Tarea 1

Como ejecutar
Para abrir es necesario hacer: py -3.12 main.py
Main.py


Clase MenuJuego maneja el menu principal e inicialización del juego

-init define usuario, juego, data_folder y config_folder como atributos principales

-obtener_configuraciones_disponibles busca archivos config*.txt y configuracion*.txt usando glob

-mostrar_configuraciones_disponibles muestra lista numerada de configs y pide selección al usuario

-mostrar_menu despliega opciones principales con info de usuario, puntaje y tableros resueltos-

-ejecutar_menu es el loop principal que maneja todas las opciones del menu

-iniciar_juego_nuevo pide nombre usuario, selecciona config y crea nueva instancia DCCasillas

-continuar_juego permite retomar partida existente y cambiar de tablero si se desea

-guardar_estado llama al método guardar_estado del juego actual para persistir datos

-recuperar_estado carga estado previo usando primera config disponible como base

-salir_programa muestra mensaje de despedida y termina la ejecución

ir_al_menu_acciones crea instancia MenuAcciones y transfiere el control


Clase MenuAcciones maneja las acciones dentro del juego activo:


-init recibe instancia DCCasillas para trabajar con el juego actual

-mostrar_menu despliega info del usuario, tablero actual y opciones de acción

-ejecutar_menu loop que maneja opciones de mostrar, modificar, verificar y encontrar solución

-mostrar_tablero llama al método mostrar_tablero del tablero actual

-modificar_casilla pide coordenadas y llama modificar_casilla del tablero correspondiente


-verificar_solucion valida si tablero esta resuelto y avanza al siguiente automáticamente

-encontrar_solucion usa algoritmo automático para resolver tablero y agrega puntaje extra

-_mostrar_sumas_actuales método auxiliar que muestra debug de sumas vs objetivos

DCCasillas


-init inicializa usuario, puntaje, tablero_actual y lista de tableros vacía

--_cargar_configuracion lee archivo config, extrae número de tableros y carga cada uno

-Valida existencia de archivos y maneja errores de carga de tableros

-abrir_tablero establece tablero_actual al numero especificado si es válido

-guardar_estado crea archivo en data/ con info completa de todos los tableros

-Guarda movimientos, dimensiones y configuración de cada tablero incluyendo casillas desabilitadas

-recuperar_estado lee archivo de usuario desde data/ y reconstruye estado completo

-Valida formato de archivo y crea nuevos objetos Tablero con info guardada

-obtener_tablero_actual retorna instancia del tablero activo o None si no hay

-contar_tableros_resueltos cuenta cuántos tableros tienen estado True resuelto

-actualizar_puntaje suma movimientos de todos los tableros resueltos para puntaje total


Tablero

-init inicializa tablero vacío con movimientos 0, estado False y casillas_deshabilitadas vacío

-cargar_tablero lee archivo config, extrae dimensiones y carga configuración completa del tablero

-Procesa casillas con X como deshabilitadas y las agrega al set correspondiente

-mostrar_tablero crea versión display reemplazando casillas deshabilitadas con puntos para visualizer

-modificar_casilla valida coordenadas, cambia estado de habilitada/deshabilitada y actualiza movimientos

-Agrega o quita casilla del set deshabilitadas según estado actual

-validar verifica que sumas de filas y columnas coincidan con objetivos establecidos

-Solo cuenta casillas habilitadas para calcular sumas y actualiza estado del tablero

-encontrar_solucion implementa backtracking para encontrar configuración que resuelva el tablero

-_backtrack función recursiva que prueba todas las combinaciones posibles de Casillas

-_validar_configuracion verifica si configuración específica de casillas resuelve el tablero correctamente

-_copiar_tablero crea copia profunda del tablero actual para no modificar el original



-
>>>>>>> 5d6131a (tarea1)

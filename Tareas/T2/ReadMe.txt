Juego de Cartas de Combate Solitario
====================================

Autor: Alfredo Nebreda Cordero

Descripción:
------------
Este proyecto es un juego de cartas por rondas donde el jugador enfrenta enemigos 
controlados por IA. La idea es administrar un mazo de cartas con diferentes tipos y 
habilidades, comprar y mejorar en la tienda, y derrotar a las IAs que van apareciendo.

------------------------------------------------
Lo implementado
------------------------------------------------
1. Cartas:
   - Cada carta tiene nombre, tipo, ataque, defensa, vida, precio, rareza y habilidad especial.
   - Se diferencian por tipo: tropa, estructura, ataque, defensa, curación y especial.
   - Las cartas pueden estar vivas, heridas o muertas.
   - Se cargan cartas base desde un CSV (cartas.csv) para facilitar la extensión del juego.

2. Inventario del jugador:
   - Incluye la colección de todas las cartas obtenidas.
   - Se puede armar un mazo activo para combatir.
   - Existe un cementerio donde van las cartas destruidas.
   - El jugador empieza con cartas iniciales definidas en parametros.py.

3. Tienda:
   - Permite comprar nuevas cartas con oro.
   - Tiene opción de “reroll” para refrescar la oferta.
   - Ofrece servicios adicionales como curar cartas heridas, resucitar cartas muertas 
     y combinar cartas para crear versiones mejoradas.

4. Enemigos IA:
   - Cada IA tiene nombre, nivel, estrategia y descripción.
   - Se cargan desde archivos CSV según la dificultad (fácil, normal, difícil).
   - Cada estrategia cambia la forma en que la IA usa sus cartas (agresivo, defensivo, 
     berserker, mágico, equilibrado).
   - Las cartas de la IA también se generan dinámicamente.

5. Multiplicadores:
   - Hay un sistema de multiplicadores que afecta ataque y defensa según el tipo de carta 
     y la IA rival.
   - Se cargan desde el archivo multiplicadores.csv.
   - Esto hace que cada combate se sienta distinto dependiendo del enemigo.

6. Combate:
   - El combate se organiza en rondas por turnos.
   - Las cartas atacan, reciben daño, pueden quedar heridas o morir.
   - El resultado de la ronda afecta al progreso del jugador (se pierden o salvan cartas).
   - Está implementada la interacción básica entre cartas de jugador y cartas de la IA.
7. Merge:
   -Mezcla de cartas tropa y estructuras 


------------------------------------------------
Lo que no implementé
------------------------------------------------
- Habilidades especiales dinámicas:
  No pude implementar las habilidades que alteran el juego mientras la ronda ya está en curso. 
  Ejemplos:
    * Robar cartas al enemigo en mitad del combate.
    * Alterar el orden o las reglas de los turnos.
    * Efectos que se duplican o cambian después de cierto número de ataques.

  Lo que sí está son habilidades simples, como:
    * Dar oro adicional.
    * Multiplicadores estáticos de ataque o defensa.

- Persistencia:
  El juego no guarda ni carga partidas, cada ejecución empieza desde cero.

------------------------------------------------
Archivos
------------------------------------------------
- tarea2.py            : archivo principal
- parametros.py        : configuraciones y parámetros
- cartas.csv           : cartas base
- multiplicadores.csv  : reglas de multiplicadores
- ias_facil.csv        : enemigos fácil
- ias_normal.csv       : enemigos normal
- ias_dificil.csv      : enemigos difícil

------------------------------------------------
Cómo jugar
------------------------------------------------
1. Guardar todos los archivos en la misma carpeta.
2. Ejecutar el juego indicando la dificultad como argumento:

   python3 tarea2.py facil
   python3 tarea2.py normal
   python3 tarea2.py dificil

3. Seguir los menús del juego para organizar el mazo, comprar en la tienda y 
   enfrentarse a las IAs.

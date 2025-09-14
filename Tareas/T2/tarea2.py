#!/usr/bin/env python3

import csv
import sys
import random
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import parametros as p  


class Dificultad(Enum):
    FACIL = "facil"
    NORMAL = "normal"
    DIFICIL = "dificil"


class TipoCarta(Enum):
    ATAQUE = "ataque"
    DEFENSA = "defensa"
    CURACION = "curacion"
    ESPECIAL = "especial"
    TROPA = "tropa"
    ESTRUCTURA = "estructura"


class EstadoCarta(Enum):
    VIVA = "viva"
    MUERTA = "muerta"
    HERIDA = "herida"

#CLASE DE CARTAS
@dataclass
class Carta:
    nombre: str
    tipo: TipoCarta
    ataque: int
    defensa: int
    vida: int
    vida_maxima: int
    costo: int
    estado: EstadoCarta = EstadoCarta.VIVA
    habilidad_especial: str = ""
    multiplicador_ataque: float = 1.0
    multiplicador_defensa: float = 1.0
    probabilidad_especial: float = 0.0

    def esta_viva(self) -> bool:
        return self.estado == EstadoCarta.VIVA and self.vida > 0

    def recibir_damage(self, damage: int):
        self.vida = max(0, self.vida - damage)
        if self.vida == 0:
            self.estado = EstadoCarta.MUERTA
        elif self.vida < self.vida_maxima:
            self.estado = EstadoCarta.HERIDA

    def curar(self, cantidad: int):
        if self.estado != EstadoCarta.MUERTA:
            self.vida = min(self.vida_maxima, self.vida + cantidad)
            if self.vida == self.vida_maxima:
                self.estado = EstadoCarta.VIVA

    def revivir(self):
        if self.estado == EstadoCarta.MUERTA:
            self.vida = 1
            self.estado = EstadoCarta.HERIDA


@dataclass
class IA:
    nombre: str
    nivel: int
    cartas: List[Carta]
    estrategia: str
    descripcion: str

    def cartas_vivas(self) -> List[Carta]:
        return [carta for carta in self.cartas if carta.esta_viva()]

    def esta_derrotada(self) -> bool:
        return len(self.cartas_vivas()) == 0


class ManejadorMultiplicadores:
    
    
    def __init__(self):
        self.multiplicadores = self.cargar_multiplicadores()
    
    def cargar_multiplicadores(self) -> Dict[Tuple[str, str], Tuple[float, float]]:
        #MULTS DE EL CVS 
        multiplicadores = {}
        try:
            with open(p.ARCHIVO_MULTIPLICADORES, 'r', encoding='utf-8') as archivo:
                reader = csv.DictReader(archivo)
                for fila in reader:
                    ia_nombre = fila['ia_nombre'].lower()
                    carta_tipo = fila['carta_tipo'].lower()
                    mult_ataque = float(fila['multiplicador_ataque'])
                    mult_defensa = float(fila['multiplicador_defensa'])
                    
                    multiplicadores[(ia_nombre, carta_tipo)] = (mult_ataque, mult_defensa)
            
            print(f"Cargados {len(multiplicadores)} multiplicadores especiales")
        except FileNotFoundError:
            print(f"Advertencia: No se encontró {p.ARCHIVO_MULTIPLICADORES}")
        except Exception as e:
            print(f"Error al cargar multiplicadores: {e}")
        
        return multiplicadores
    
    def obtener_multiplicadores(self, ia_nombre: str, tipo_carta: str) -> Tuple[float, float]:
        #CONSIGUE LOS MULTIPLICADORES DE LAS AIS Y LOS APLICA 
        llave = (ia_nombre.lower(), tipo_carta.lower())
        return self.multiplicadores.get(llave, (1.0, 1.0))


class Tienda:
    def __init__(self):
        self.cartas_disponibles = self.generar_cartas_tienda()

    def generar_cartas_tienda(self) -> List[Carta]:
        cartas_base = []

        try:
            with open(p.ARCHIVO_CARTAS, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    #PUSE MAS TIPOS PORQ NO ENTENDI COMO FUNCIONABAN LAS HABILIDADES EN UN PRINCIPIO 
                    tipo_str = row["tipo"].lower()
                    if tipo_str == "tropa":
                        tipo = TipoCarta.TROPA
                    elif tipo_str == "estructura":
                        tipo = TipoCarta.ESTRUCTURA
                    elif tipo_str == "defensa":
                        tipo = TipoCarta.DEFENSA
                    elif tipo_str == "curacion":
                        tipo = TipoCarta.CURACION
                    elif tipo_str == "especial":
                        tipo = TipoCarta.ESPECIAL
                    else:
                        tipo = TipoCarta.ATAQUE

                    ataque = int(float(row["ataque"]) * float(row["multiplicador_ataque"]))
                    defensa = int(float(row["vida_maxima"]) * float(row["multiplicador_defensa"]))
                    vida_maxima = int(float(row["vida_maxima"]))
                    vida_actual = vida_maxima
                    precio = int(float(row["precio"]))
                    habilidad = row["descripcion_habilidad"]

                    carta = Carta(
                        row["nombre"],
                        tipo,
                        ataque,
                        defensa,
                        vida_actual,
                        vida_maxima,
                        precio,
                        habilidad_especial=habilidad,
                        multiplicador_ataque=float(row["multiplicador_ataque"]),
                        multiplicador_defensa=float(row["multiplicador_defensa"])
                    )
                    cartas_base.append(carta)
        except FileNotFoundError:
            print(f"Error: No se pudo encontrar {p.ARCHIVO_CARTAS}")
            return []

        num_cartas = random.randint(p.MIN_CARTAS_TIENDA, p.MAX_CARTAS_TIENDA)
        return random.sample(cartas_base, min(num_cartas, len(cartas_base)))

    def reroll_tienda(self):
        self.cartas_disponibles = self.generar_cartas_tienda()
  #LLAMAR DENUEVO LA FUNC 

class Jugador:
    #INICIAR JUGADOR 
    def __init__(self, nombre: str = "Jugador"):
        self.nombre = nombre
        self.coleccion: List[Carta] = []
        self.mazo_activo: List[Carta] = []
        self.cementerio: List[Carta] = []
        self.oro: int = p.ORO_INICIAL
        self.ronda_actual: int = 1

        # Cartas inicialEs desde parametros.py
        cartas_iniciales = []
        for carta_data in p.CARTAS_INICIALES:
            tipo_str = carta_data["tipo"].lower()
            if tipo_str == "defensa":
                tipo = TipoCarta.DEFENSA
            else:
                tipo = TipoCarta.ATAQUE
            
            carta = Carta(
                carta_data["nombre"],
                tipo,
                carta_data["ataque"],
                carta_data["defensa"],
                carta_data["vida"],
                carta_data["vida"],
                carta_data["costo"]
            )
            cartas_iniciales.append(carta)
        
        self.coleccion.extend(cartas_iniciales)
        self.mazo_activo.extend(cartas_iniciales)
  #getters de las listas 
  
    def cartas_vivas_mazo_activo(self) -> List[Carta]:
        return [carta for carta in self.mazo_activo if carta.esta_viva()]

    def cartas_vivas_coleccion(self) -> List[Carta]:
        return [carta for carta in self.coleccion if carta.esta_viva()]

    def esta_derrotado(self) -> bool:
        return len(self.cartas_vivas_mazo_activo()) == 0

    def mover_cartas_muertas_cementerio(self):
        cartas_muertas = [c for c in self.mazo_activo if not c.esta_viva()]
        for carta in cartas_muertas:
            if carta in self.mazo_activo:
                self.mazo_activo.remove(carta)
            if carta not in self.cementerio:
                self.cementerio.append(carta)

    def agregar_carta_coleccion(self, carta: Carta):
        self.coleccion.append(carta)


class JuegoCombate:
    def __init__(self, dificultad: Dificultad):
        self.dificultad = dificultad
        self.jugador = Jugador()
        self.tienda = Tienda()
        self.manejador_multiplicadores = ManejadorMultiplicadores()
        self.ias_enemigas = self._generar_ias_enemigas()
        self.ia_actual_index = 0
        self.ronda = 1

    def _generar_ias_enemigas(self) -> List[IA]:
        archivo_csv = p.ARCHIVOS_IAS[self.dificultad.value]
        config = p.CONFIG_DIFICULTAD[self.dificultad.value]

        ias_data = []
        try:
            with open(archivo_csv, 'r', encoding='utf-8') as archivo:
                reader = csv.DictReader(archivo)
                for fila in reader:
                    ia_info = {
                        'nombre': fila['nombre'],
                        'vida_maxima': int(fila['vida_maxima']),
                        'ataque': int(fila['ataque']),
                        'descripcion': fila['descripcion'],
                        'probabilidad_especial': float(fila['probabilidad_especial']),
                        'velocidad': float(fila['velocidad'])
                    }
                    ias_data.append(ia_info)
        except FileNotFoundError:
            print(f"Error: No se pudo encontrar el archivo {archivo_csv}")
            return []

        ias_enemigas = []
        num_ias_disponibles = len(ias_data)
        num_ias_a_crear = min(config["num_ias"], num_ias_disponibles)

        if num_ias_disponibles < config["num_ias"]:
            ias_seleccionadas = ias_data * ((config["num_ias"] // num_ias_disponibles) + 1)
            ias_seleccionadas = ias_seleccionadas[:config["num_ias"]]
        else:
            ias_seleccionadas = random.sample(ias_data, num_ias_a_crear)

        for i, ia_info in enumerate(ias_seleccionadas):
            nivel = i + 1
            mult_cartas = config["multiplicador_cartas"] + (i * 0.1)

            cartas_ia = self._generar_cartas_para_ia(ia_info, mult_cartas, nivel)
            estrategia = self._determinar_estrategia(ia_info)

            ia = IA(
                nombre=ia_info['nombre'],
                nivel=nivel,
                cartas=cartas_ia,
                estrategia=estrategia,
                descripcion=ia_info['descripcion']
            )
            ias_enemigas.append(ia)

        return ias_enemigas

    def _generar_cartas_para_ia(self, ia_info: dict, multiplicador: float, nivel: int) -> List[Carta]:
        cartas = []
        num_cartas = p.CARTAS_BASE_POR_NIVEL + nivel
        
        ataque_base = ia_info['ataque']
        vida_base = ia_info['vida_maxima']

        for i in range(num_cartas):
            variacion = random.uniform(p.VARIACION_MIN, p.VARIACION_MAX)
            tipo = random.choice(list(TipoCarta))
            
            # Calcular stats base y aplicar los modf de las aios 
            ataque_carta = int((ataque_base * p.MULTIPLICADOR_ATAQUE_IA + 
                              random.randint(*p.RANGO_ATAQUE_RANDOM)) * multiplicador * variacion)
            defensa_carta = int((ataque_base * p.MULTIPLICADOR_DEFENSA_IA + 
                               random.randint(*p.RANGO_DEFENSA_RANDOM)) * multiplicador * variacion)
            vida_carta = int((vida_base * p.MULTIPLICADOR_VIDA_IA + 
                            random.randint(*p.RANGO_VIDA_RANDOM)) * multiplicador * variacion)
            
            # Aplicar multiplicadores especiales del archivo multiplicadores.csv
            mult_ataque_especial, mult_defensa_especial = self.manejador_multiplicadores.obtener_multiplicadores(
                ia_info['nombre'], tipo.value
            )
            
            # Aplicar multiplicadores especiales si existen de las habilidades
            if mult_ataque_especial != 1.0 or mult_defensa_especial != 1.0:
                ataque_carta = int(ataque_carta * mult_ataque_especial)
                defensa_carta = int(defensa_carta * mult_defensa_especial)
                print(f"  Aplicados multiplicadores especiales para {ia_info['nombre']} - {tipo.value}")
            
            # Asegurar valores minimos para q existan en si 
            ataque_carta = max(ataque_carta, p.MIN_ATAQUE_CARTA)
            defensa_carta = max(defensa_carta, p.MIN_DEFENSA_CARTA)
            vida_carta = max(vida_carta, p.MIN_VIDA_CARTA)

            carta = Carta(
                nombre=f"{ia_info['nombre']} - Carta {i+1}",
                tipo=tipo,
                ataque=ataque_carta,
                defensa=defensa_carta,
                vida=vida_carta,
                vida_maxima=vida_carta,
                costo=random.randint(1, 5),
                multiplicador_ataque=mult_ataque_especial,
                multiplicador_defensa=mult_defensa_especial
            )
            cartas.append(carta)

        return cartas

    def _determinar_estrategia(self, ia_info: dict) -> str:
        ataque = ia_info['ataque']
        velocidad = ia_info['velocidad']
        prob_especial = ia_info['probabilidad_especial']

        if ataque > p.UMBRAL_ATAQUE_AGRESIVO and velocidad > p.UMBRAL_VELOCIDAD_AGRESIVO:
            return "agresivo"
        elif prob_especial > p.UMBRAL_PROB_ESPECIAL_MAGICO:
            return "magico"
        elif velocidad < p.UMBRAL_VELOCIDAD_DEFENSIVO:
            return "defensivo"
        elif ataque > p.UMBRAL_ATAQUE_BERSERKER and prob_especial > p.UMBRAL_PROB_ESPECIAL_BERSERKER:
            return "berserker"
        else:
            return "equilibrado"

    def mostrar_presentacion_ia(self, ia: IA):
        print("\n" + p.SEPARADOR)
        print("¡ENEMIGO DETECTADO!")
        print(p.SEPARADOR)
        print(f"Nombre: {ia.nombre}")
        print(f"Nivel: {ia.nivel}")
        print(f"Estrategia: {ia.estrategia}")
        print(f"Descripción: {ia.descripcion}")
        print(f"Número de cartas: {len(ia.cartas)}")
        print("\nEstadísticas promedio de sus cartas:")
        if ia.cartas:
            avg_ataque = sum(c.ataque for c in ia.cartas) / len(ia.cartas)
            avg_defensa = sum(c.defensa for c in ia.cartas) / len(ia.cartas)
            avg_vida = sum(c.vida_maxima for c in ia.cartas) / len(ia.cartas)
            print(f"  Ataque promedio: {avg_ataque:.1f}")
            print(f"  Defensa promedio: {avg_defensa:.1f}")
            print(f"  Vida promedio: {avg_vida:.1f}")
        print(p.SEPARADOR)
        input("Presiona ENTER para continuar...")
#menu normal ejecuccion 
    def mostrar_menu_principal(self):
        while True:
            print("\n" + p.SEPARADOR_CORTO)
            print("MENÚ PRINCIPAL")
            print(p.SEPARADOR_CORTO)
            print(f"Ronda: {self.ronda}")
            print(f"Oro disponible: {self.jugador.oro}")
            print(f"Mazo activo: {len(self.jugador.mazo_activo)}/{p.MAX_CARTAS_MAZO} cartas")
            print(f"Enemigo actual: {self.ias_enemigas[self.ia_actual_index].nombre}")
            print("\nOpciones:")
            print("1. Inventario")
            print("2. Ver información de mis cartas")
            print("3. Ir a la tienda")
            print("4. Espiar enemigo")
            print("5. Iniciar combate")
            print("6. Salir del juego")

            opcion = input("\nElige una opción (1-6): ").strip()

            if opcion == "1":
                self.menu_inventario()
            elif opcion == "2":
                self.mostrar_cartas_jugador()
            elif opcion == "3":
                self.menu_tienda()
            elif opcion == "4":
                self.espiar_enemigo()
            elif opcion == "5":
                if self.iniciar_combate():
                    return True
                else:
                    return False
            elif opcion == "6":
                print("¡Gracias por jugar!")
                return False
            else:
                print("Opción inválida. Por favor elige 1-6.")
#segundo menu 
    def menu_inventario(self):
        while True:
            print("\n" + p.SEPARADOR)
            print("INVENTARIO - GESTIÓN DE MAZO")
            print(p.SEPARADOR)
            print(f"Mazo activo: {len(self.jugador.mazo_activo)}/{p.MAX_CARTAS_MAZO} cartas")
            print(f"Colección total: {len(self.jugador.coleccion)} cartas")

            print("\nMazo activo (cartas que usarás en combate):")
            if not self.jugador.mazo_activo:
                print("   (Vacío)")
            else:
                for i, carta in enumerate(self.jugador.mazo_activo, 1):
                    print(f"   {i}. {carta.nombre} [ATK:{carta.ataque} DEF:{carta.defensa} HP:{carta.vida}/{carta.vida_maxima}]")

            print("\nOpciones:")
            print("1. Seleccionar cartas para el mazo activo")
            print("2. Remover carta del mazo activo")
            print("3. Reordenar mazo activo")
            print("4. Ver colección completa")
            print("5. Volver al menú principal")

            opcion = input("\nElige una opción (1-5): ").strip()

            if opcion == "1":
                self.seleccionar_cartas_mazo()
            elif opcion == "2":
                self.remover_carta_mazo()
            elif opcion == "3":
                self.reordenar_mazo()
            elif opcion == "4":
                self.ver_coleccion_completa()
            elif opcion == "5":
                break
            else:
                print("Opción inválida. Por favor elige 1-5.")

    def seleccionar_cartas_mazo(self):
        cartas_disponibles = [c for c in self.jugador.coleccion 
                             if c not in self.jugador.mazo_activo and c.esta_viva()]

        if not cartas_disponibles:
            print("No tienes cartas disponibles para agregar al mazo.")
            input("Presiona ENTER para continuar...")
            return

        if len(self.jugador.mazo_activo) >= p.MAX_CARTAS_MAZO:
            print(f"Tu mazo activo ya tiene el máximo de {p.MAX_CARTAS_MAZO} cartas.")
            print("Debes remover una carta antes de agregar otra.")
            input("Presiona ENTER para continuar...")
            return

        print("\nCartas disponibles para agregar al mazo:")
        for i, carta in enumerate(cartas_disponibles, 1):
            print(f"{i}. {carta.nombre} [{carta.tipo.value}] ATK:{carta.ataque} DEF:{carta.defensa} HP:{carta.vida}/{carta.vida_maxima}")
            if carta.habilidad_especial:
                print(f"   Habilidad: {carta.habilidad_especial}")

        try:
            idx = int(input("¿Qué carta quieres agregar? (0 para cancelar): ")) - 1
            if idx == -1:
                return
            if 0 <= idx < len(cartas_disponibles):
                if len(self.jugador.mazo_activo) < p.MAX_CARTAS_MAZO:
                    carta_seleccionada = cartas_disponibles[idx]
                    self.jugador.mazo_activo.append(carta_seleccionada)
                    print(f"¡{carta_seleccionada.nombre} agregada al mazo activo!")
                else:
                    print(f"Tu mazo activo ya está lleno ({p.MAX_CARTAS_MAZO}/{p.MAX_CARTAS_MAZO} cartas).")
            else:
                print("Opción inválida.")
        except ValueError:
            print("Por favor ingresa un número válido.")

        input("Presiona ENTER para continuar...")

    def remover_carta_mazo(self):
        if not self.jugador.mazo_activo:
            print("Tu mazo activo está vacío.")
            input("Presiona ENTER para continuar...")
            return

        print("\nCartas en el mazo activo:")
        for i, carta in enumerate(self.jugador.mazo_activo, 1):
            print(f"{i}. {carta.nombre} [{carta.tipo.value}]")

        try:
            idx = int(input("¿Qué carta quieres remover? (0 para cancelar): ")) - 1
            if idx == -1:
                return
            if 0 <= idx < len(self.jugador.mazo_activo):
                carta_removida = self.jugador.mazo_activo.pop(idx)
                print(f"¡{carta_removida.nombre} removida del mazo activo!")
            else:
                print("Opción inválida.")
        except ValueError:
            print("Por favor ingresa un número válido.")

        input("Presiona ENTER para continuar...")

    def reordenar_mazo(self):
        if len(self.jugador.mazo_activo) <= 1:
            print("Necesitas al menos 2 cartas para reordenar.")
            input("Presiona ENTER para continuar...")
            return

        while True:
            print("\nOrden actual del mazo:")
            for i, carta in enumerate(self.jugador.mazo_activo, 1):
                print(f"{i}. {carta.nombre}")

            print("\nOpciones:")
            print("1. Mover carta a nueva posición")
            print("2. Intercambiar dos cartas")
            print("3. Terminar reordenamiento")

            opcion = input("Elige una opción: ").strip()

            if opcion == "1":
                self.mover_carta_posicion()
            elif opcion == "2":
                self.intercambiar_cartas()
            elif opcion == "3":
                break
            else:
                print("Opción inválida.")
#mas menus 
    def mover_carta_posicion(self):
        try:
            desde = int(input(f"Posición de la carta a mover (1-{len(self.jugador.mazo_activo)}): ")) - 1
            hacia = int(input(f"Nueva posición (1-{len(self.jugador.mazo_activo)}): ")) - 1

            if 0 <= desde < len(self.jugador.mazo_activo) and 0 <= hacia < len(self.jugador.mazo_activo):
                carta = self.jugador.mazo_activo.pop(desde)
                self.jugador.mazo_activo.insert(hacia, carta)
                print(f"¡Carta movida a la posición {hacia + 1}!")
            else:
                print("Posiciones inválidas.")
        except ValueError:
            print("Por favor ingresa números válidos.")

    def intercambiar_cartas(self):
        try:
            pos1 = int(input(f"Primera posición (1-{len(self.jugador.mazo_activo)}): ")) - 1
            pos2 = int(input(f"Segunda posición (1-{len(self.jugador.mazo_activo)}): ")) - 1

            if 0 <= pos1 < len(self.jugador.mazo_activo) and 0 <= pos2 < len(self.jugador.mazo_activo) and pos1 != pos2:
                self.jugador.mazo_activo[pos1], self.jugador.mazo_activo[pos2] = \
                    self.jugador.mazo_activo[pos2], self.jugador.mazo_activo[pos1]
                print("¡Cartas intercambiadas!")
            else:
                print("Posiciones inválidas.")
        except ValueError:
            print("Por favor ingresa números válidos.")

    def ver_coleccion_completa(self):
        print("\n" + p.SEPARADOR)
        print("COLECCIÓN COMPLETA")
        print(p.SEPARADOR)

        if not self.jugador.coleccion:
            print("No tienes cartas en la colección.")
        else:
            for i, carta in enumerate(self.jugador.coleccion, 1):
                en_mazo = "[MAZO]" if carta in self.jugador.mazo_activo else ""
                print(f"{i}. {en_mazo} {carta.nombre} [{carta.tipo.value}]")
                print(f"   ATK: {carta.ataque} | DEF: {carta.defensa} | HP: {carta.vida}/{carta.vida_maxima}")
                if carta.habilidad_especial:
                    print(f"   Habilidad: {carta.habilidad_especial}")
                print()

        input("Presiona ENTER para continuar...")

    def mostrar_cartas_jugador(self):
        print("\n" + p.SEPARADOR)
        print("INFORMACIÓN DE CARTAS")
        print(p.SEPARADOR)

        print("MAZO ACTIVO (para combate):")
        if not self.jugador.mazo_activo:
            print("   No tienes cartas en el mazo activo.")
        else:
            for i, carta in enumerate(self.jugador.mazo_activo, 1):
                print(f"   {i}. {carta.nombre} [{carta.tipo.value}]")
                print(f"      ATK: {carta.ataque} | DEF: {carta.defensa} | HP: {carta.vida}/{carta.vida_maxima}")
                if carta.habilidad_especial:
                    print(f"      Habilidad: {carta.habilidad_especial}")

        print(f"\nCOLECCIÓN COMPLETA ({len(self.jugador.coleccion)} cartas):")
        if not self.jugador.coleccion:
            print("   No tienes cartas en la colección.")
        else:
            for i, carta in enumerate(self.jugador.coleccion, 1):
                en_mazo = "[MAZO]" if carta in self.jugador.mazo_activo else ""
                print(f"   {i}. {en_mazo} {carta.nombre} [{carta.tipo.value}]")
                print(f"      ATK: {carta.ataque} | DEF: {carta.defensa} | HP: {carta.vida}/{carta.vida_maxima}")
                if carta.habilidad_especial:
                    print(f"      Habilidad: {carta.habilidad_especial}")

        if self.jugador.cementerio:
            print(f"\nCEMENTERIO ({len(self.jugador.cementerio)} cartas):")
            for i, carta in enumerate(self.jugador.cementerio, 1):
                print(f"   {i}. {carta.nombre} [{carta.tipo.value}]")

        input("\nPresiona ENTER para volver al menú...")
#mas menus GRRRR
    def menu_tienda(self):
        while True:
            print("\n" + p.SEPARADOR)
            print("TIENDA")
            print(p.SEPARADOR)
            print(f"Dinero disponible: {self.jugador.oro}G")
            print("\nCartas disponibles:")

            for i, carta in enumerate(self.tienda.cartas_disponibles, 1):
                print(f"[{i}] {carta.nombre} .......... {carta.costo}G")
                print(f"    [{carta.tipo.value}] ATK:{carta.ataque} DEF:{carta.defensa} HP:{carta.vida}")
                if carta.habilidad_especial:
                    print(f"    Habilidad: {carta.habilidad_especial}")
                print()

            print("Servicios:")
            print("[6] Curar carta")
            print("[7] Revivir carta del cementerio")
            print(f"[8] Reroll catálogo (costo {p.COSTO_REROLL}G)")
            print("[9] Taller (combinar cartas)")
            print("[0] Volver al Menú principal")

            opcion = input("\nIndique su opción: ").strip()

            if opcion in ["1", "2", "3", "4", "5"]:
                try:
                    idx = int(opcion) - 1
                    if 0 <= idx < len(self.tienda.cartas_disponibles):
                        self.comprar_carta(idx)
                    else:
                        print("Opción inválida.")
                except ValueError:
                    print("Por favor ingresa un número válido.")
            elif opcion == "6":
                self.curar_carta()
            elif opcion == "7":
                self.revivir_carta()
            elif opcion == "8":
                self.reroll_tienda()
            elif opcion == "9":
                self.taller_combinacion()
            elif opcion == "0":
                break
            else:
                print("Opción inválida.")
#sacar el oro a la persona y agregar a la colecc 
    def comprar_carta(self, idx: int):
        carta = self.tienda.cartas_disponibles[idx]
        if self.jugador.oro >= carta.costo:
            self.jugador.oro -= carta.costo
            nueva_carta = Carta(
                carta.nombre, carta.tipo, carta.ataque, carta.defensa,
                carta.vida, carta.vida_maxima, carta.costo, carta.estado,
                carta.habilidad_especial
            )
            self.jugador.agregar_carta_coleccion(nueva_carta)
            print(f"¡Compraste {carta.nombre}! Se agregó a tu colección.")
            self.tienda.cartas_disponibles.pop(idx)
        else:
            print("No tienes suficiente oro.")

    def reroll_tienda(self):
        if self.jugador.oro >= p.COSTO_REROLL:
            self.jugador.oro -= p.COSTO_REROLL
            self.tienda.reroll_tienda()
            print("¡Tienda actualizada!")
        else:
            print("No tienes suficiente oro.")
#sacar el oro  y llamar la funcion de arribva
    def revivir_carta(self):
        if not self.jugador.cementerio:
            print("No tienes cartas en el cementerio para revivir.")
            return

        print("Cartas en el cementerio:")
        for i, carta in enumerate(self.jugador.cementerio, 1):
            costo_revivir = int(carta.costo * p.COSTO_REVIVIR_MULTIPLICADOR)
            print(f"{i}. {carta.nombre} - Costo: {costo_revivir} oro")

        try:
            idx = int(input("¿Qué carta quieres revivir? (0 para cancelar): ")) - 1
            if idx == -1:
                return
            if 0 <= idx < len(self.jugador.cementerio):
                carta = self.jugador.cementerio[idx]
                costo_revivir = int(carta.costo * p.COSTO_REVIVIR_MULTIPLICADOR)

                if self.jugador.oro >= costo_revivir:
                    self.jugador.oro -= costo_revivir
                    carta.revivir()
                    self.jugador.cementerio.remove(carta)
                    self.jugador.coleccion.append(carta)
                    print(f"¡{carta.nombre} ha sido revivida y agregada a tu colección!")
                else:
                    print("No tienes suficiente oro.")
            else:
                print("Opción inválida.")
        except ValueError:
            print("Por favor ingresa un número válido.")

    def curar_carta(self):
        cartas_heridas = [c for c in self.jugador.coleccion if c.estado == EstadoCarta.HERIDA]
        if not cartas_heridas:
            print("No tienes cartas heridas para curar.")
            return

        if self.jugador.oro < p.COSTO_CURAR:
            print("No tienes suficiente oro.")
            return

        print("Cartas heridas:")
        for i, carta in enumerate(cartas_heridas, 1):
            print(f"{i}. {carta.nombre} ({carta.vida}/{carta.vida_maxima} HP)")

        try:
            idx = int(input("¿Qué carta quieres curar? (0 para cancelar): ")) - 1
            if idx == -1:
                return
            if 0 <= idx < len(cartas_heridas):
                self.jugador.oro -= p.COSTO_CURAR
                cartas_heridas[idx].curar(cartas_heridas[idx].vida_maxima)
                print(f"¡{cartas_heridas[idx].nombre} ha sido curada completamente!")
            else:
                print("Opción inválida.")
        except ValueError:
            print("Por favor ingresa un número válido.")

    def taller_combinacion(self):
        print("\nTALLER DE COMBINACIÓN")
        print("Combina una carta TROPA con una ESTRUCTURA para crear una carta mixta más poderosa!")
        print(f"Costo de combinación: {p.COSTO_COMBINACION} oro")

        if len(self.jugador.coleccion) < 2:
            print("Necesitas al menos 2 cartas en tu colección para combinar.")
            input("Presiona ENTER para continuar...")
            return

        if self.jugador.oro < p.COSTO_COMBINACION:
            print("No tienes suficiente oro para realizar una combinación.")
            input("Presiona ENTER para continuar...")
            return

        tropas = [(i, carta) for i, carta in enumerate(self.jugador.coleccion)
                 if carta.tipo == TipoCarta.TROPA]
        estructuras = [(i, carta) for i, carta in enumerate(self.jugador.coleccion)
                      if carta.tipo == TipoCarta.ESTRUCTURA]

        if not tropas or not estructuras:
            print("Necesitas al menos una carta TROPA y una ESTRUCTURA para combinar.")
            print("Tipos disponibles en tu colección:")
            tipos_disponibles = set(carta.tipo.value for carta in self.jugador.coleccion)
            for tipo in tipos_disponibles:
                print(f"  - {tipo}")
            input("Presiona ENTER para continuar...")
            return

        print("\nCartas TROPA disponibles:")
        for i, (idx_original, carta) in enumerate(tropas, 1):
            print(f"{i}. {carta.nombre} - ATK:{carta.ataque} DEF:{carta.defensa} HP:{carta.vida}/{carta.vida_maxima}")

        print("\nCartas ESTRUCTURA disponibles:")
        for i, (idx_original, carta) in enumerate(estructuras, 1):
            print(f"{i}. {carta.nombre} - ATK:{carta.ataque} DEF:{carta.defensa} HP:{carta.vida}/{carta.vida_maxima}")

        print("\n0. Volver a la tienda")

        try:
            tropa_idx = int(input("Elige una carta TROPA: ")) - 1
            if tropa_idx == -1:
                return

            if 0 <= tropa_idx < len(tropas):
                estructura_idx = int(input("Elige una carta ESTRUCTURA: ")) - 1
                if estructura_idx == -1:
                    return

                if 0 <= estructura_idx < len(estructuras):
                    tropa = tropas[tropa_idx][1]
                    estructura = estructuras[estructura_idx][1]

                    print(f"\n¿Confirmas combinar {tropa.nombre} + {estructura.nombre}?")
                    print(f"Costo: {p.COSTO_COMBINACION} oro")
                    print("Las cartas originales serán destruidas.")

                    confirmar = input("S/N: ").upper()
                    if confirmar == 'S':
                        self.realizar_combinacion_tropa_estructura(
                            tropa, estructura, tropas[tropa_idx][0], estructuras[estructura_idx][0]
                        )
                    else:
                        print("Combinación cancelada.")
                else:
                    print("Opción de estructura inválida.")
            else:
                print("Opción de tropa inválida.")
        except ValueError:
            print("Por favor ingresa números válidos.")

        input("Presiona ENTER para continuar...")

    def realizar_combinacion_tropa_estructura(self, tropa: Carta, estructura: Carta, idx_tropa: int, idx_estructura: int):
        self.jugador.oro -= p.COSTO_COMBINACION
        carta_mixta = self.crear_carta_mixta(tropa, estructura)

        indices_a_remover = sorted([idx_tropa, idx_estructura], reverse=True)
        for idx in indices_a_remover:
            carta_removida = self.jugador.coleccion.pop(idx)
            if carta_removida in self.jugador.mazo_activo:
                self.jugador.mazo_activo.remove(carta_removida)

        self.jugador.coleccion.append(carta_mixta)

        print(f"\n¡Combinación exitosa!")
        print(f"Nueva carta mixta: {carta_mixta.nombre}")
        print(f"ATK:{carta_mixta.ataque} DEF:{carta_mixta.defensa} HP:{carta_mixta.vida_maxima}")
        if carta_mixta.habilidad_especial:
            print(f"Habilidad: {carta_mixta.habilidad_especial}")

    def crear_carta_mixta(self, tropa: Carta, estructura: Carta) -> Carta:
        nombre = f"{tropa.nombre}-{estructura.nombre} [Mixta]"
        ataque = tropa.ataque
        vida_total = estructura.vida_maxima + int(tropa.vida_maxima * p.MULTIPLICADOR_VIDA_TROPA_EN_MIXTA)
        mult_ataque = max(tropa.multiplicador_ataque, estructura.multiplicador_ataque)
        mult_defensa = min(tropa.multiplicador_defensa, estructura.multiplicador_defensa)
        defensa = (tropa.defensa + estructura.defensa) // 2
        prob_especial = ((tropa.probabilidad_especial + estructura.probabilidad_especial) / 2) + p.BONUS_PROB_ESPECIAL_MIXTA
        prob_especial = min(p.MAX_PROB_ESPECIAL, prob_especial)

        habilidad = ""
        if tropa.habilidad_especial and estructura.habilidad_especial:
            habilidad = f"Mixta: {tropa.habilidad_especial} + {estructura.habilidad_especial}"
        elif tropa.habilidad_especial:
            habilidad = f"Mejorada: {tropa.habilidad_especial}"
        elif estructura.habilidad_especial:
            habilidad = f"Mejorada: {estructura.habilidad_especial}"
        else:
            habilidad = "Sinergia Tropa-Estructura"

        return Carta(
            nombre=nombre,
            tipo=TipoCarta.ESPECIAL,
            ataque=ataque,
            defensa=defensa,
            vida=vida_total,
            vida_maxima=vida_total,
            costo=0,
            estado=EstadoCarta.VIVA,
            habilidad_especial=habilidad,
            multiplicador_ataque=mult_ataque,
            multiplicador_defensa=mult_defensa,
            probabilidad_especial=prob_especial
        )

    def espiar_enemigo(self):
        ia_actual = self.ias_enemigas[self.ia_actual_index]
        print("\n" + p.SEPARADOR_CORTO)
        print("ESPIONAJE ENEMIGO")
        print(p.SEPARADOR_CORTO)
        print(f"Enemigo: {ia_actual.nombre}")
        print(f"Estrategia: {ia_actual.estrategia}")
        print(f"Cartas restantes: {len(ia_actual.cartas_vivas())}")

        print("\nCartas enemigas:")
        for i, carta in enumerate(ia_actual.cartas_vivas(), 1):
            print(f"{i}. {carta.nombre}")
            print(f"   Tipo: {carta.tipo.value}")
            print(f"   Ataque aproximado: {carta.ataque - 2} - {carta.ataque + 2}")
            print(f"   Defensa aproximada: {carta.defensa - 2} - {carta.defensa + 2}")
            print(f"   Estado: {'Saludable' if carta.vida > carta.vida_maxima * 0.7 else 'Herida'}")
            print()

        input("Presiona ENTER para volver al menú...")
#devolver data de la siguiente ai en forma de cartas 
    def iniciar_combate(self):
        if not self.jugador.mazo_activo:
            print("¡No tienes cartas en tu mazo activo!")
            print("Debes seleccionar al menos una carta en el Inventario antes de combatir.")
            input("Presiona ENTER para continuar...")
            return True

        if len(self.jugador.cartas_vivas_mazo_activo()) == 0:
            print("¡Todas las cartas de tu mazo activo están muertas!")
            print("Debes curar o revivir cartas, o cambiar tu mazo activo.")
            input("Presiona ENTER para continuar...")
            return True

        ia_actual = self.ias_enemigas[self.ia_actual_index]

        print("\n" + "="*20)
        print("INICIANDO COMBATE")
        print("="*20)
        print(f"Tu equipo vs {ia_actual.nombre}")
        print()

        turno = 1
        while not self.jugador.esta_derrotado() and not ia_actual.esta_derrotada():
            print(f"--- TURNO {turno} ---")

            self.fase_ataque_jugador(ia_actual)
            if ia_actual.esta_derrotada():
                break

            self.fase_ataque_ia(ia_actual)
            if self.jugador.esta_derrotado():
                break

            turno += 1
            input("\nPresiona ENTER para continuar al siguiente turno...")

        self.jugador.mover_cartas_muertas_cementerio()

        if self.jugador.esta_derrotado():
            print("\nHAS SIDO DERROTADO")
            print("¡Game Over!")
            return False
        else:
            print(f"\n¡VICTORIA!")
            print(f"Has derrotado a {ia_actual.nombre}!")

            config = p.CONFIG_DIFICULTAD[self.dificultad.value]
            oro_ganado = config["oro_recompensa_base"] + (ia_actual.nivel * config["oro_recompensa_nivel"])
            self.jugador.oro += oro_ganado
            print(f"Recompensa: {oro_ganado} oro")

            self.ia_actual_index += 1
            if self.ia_actual_index >= len(self.ias_enemigas):
                print("\n¡FELICITACIONES!")
                print("¡Has completado el juego derrotando a todos los enemigos!")
                return False
            else:
                self.ronda += 1
                print(f"\nPreparándote para la ronda {self.ronda}...")
                return True

    def fase_ataque_jugador(self, ia_enemiga: IA):
        cartas_jugador = self.jugador.cartas_vivas_mazo_activo()
        cartas_enemigas = ia_enemiga.cartas_vivas()

        if not cartas_jugador or not cartas_enemigas:
            return

        print("Fase de ataque - TU TURNO")

        for carta_atacante in cartas_jugador:
            if not cartas_enemigas:
                break

            objetivo = random.choice(cartas_enemigas)
            damage = max(p.DAMAGE_MINIMO, carta_atacante.ataque - objetivo.defensa // p.DIVISOR_DEFENSA)

            print(f"{carta_atacante.nombre} ataca a {objetivo.nombre} por {damage} de daño")
            objetivo.recibir_damage(damage)

            if objetivo.vida <= 0:
                print(f"  {objetivo.nombre} ha sido derrotada!")
                cartas_enemigas.remove(objetivo)
#calcular daño del jugador pasar primero por estructuras
    def fase_ataque_ia(self, ia_enemiga: IA):
        cartas_jugador = self.jugador.cartas_vivas_mazo_activo()
        cartas_enemigas = ia_enemiga.cartas_vivas()

        if not cartas_jugador or not cartas_enemigas:
            return

        print("Fase de ataque - TURNO ENEMIGO")

        for carta_atacante in cartas_enemigas:
            if not cartas_jugador:
                break

            if ia_enemiga.estrategia == "agresivo":
                objetivo = min(cartas_jugador, key=lambda c: c.vida)
            elif ia_enemiga.estrategia == "defensivo":
                objetivo = max(cartas_jugador, key=lambda c: c.ataque)
            else:
                objetivo = random.choice(cartas_jugador)

            damage = max(p.DAMAGE_MINIMO, carta_atacante.ataque - objetivo.defensa // p.DIVISOR_DEFENSA)

            print(f"{carta_atacante.nombre} ataca a {objetivo.nombre} por {damage} de daño")
            objetivo.recibir_damage(damage)

            if objetivo.vida <= 0:
                print(f"  {objetivo.nombre} ha sido derrotada!")
                cartas_jugador.remove(objetivo)
#calcular daño de la ai pasar primero por estructuras
    def ejecutar(self):
        print(p.TITULO_JUEGO)
        print(f"Dificultad: {self.dificultad.value}")
        print(f"Enemigos a enfrentar: {len(self.ias_enemigas)}")

        for ia in self.ias_enemigas:
            self.mostrar_presentacion_ia(ia)

        while self.ia_actual_index < len(self.ias_enemigas):
            continuar = self.mostrar_menu_principal()
            if not continuar:
                break

        print("\n¡Gracias por jugar!")

#ejectura todo 
def main():
    if len(sys.argv) != 2:
        print("Uso: python tarea2.py <dificultad>")
        print("Dificultades disponibles: facil, normal, dificil")
        sys.exit(1)

    dificultad_str = sys.argv[1].lower()

    try:
        dificultad = Dificultad(dificultad_str)
    except ValueError:
        print(f"Dificultad '{dificultad_str}' no válida.")
        print("Dificultades disponibles: facil, normal, dificil")
        sys.exit(1)

    juego = JuegoCombate(dificultad)
    juego.ejecutar()


if __name__ == "__main__":
    main()
    
    
    
    #LEI DESPUES DE HACER TODO EN EN ESTE .PY QUE HABIA QUE HJACER MENOS DE 400 LINEAS, ME REHUSO A DIVIDIRLO 

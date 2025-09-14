#!/usr/bin/env python3
"""
Archivo de parámetros y constantes para el Juego de Cartas de Combate
"""


ARCHIVO_CARTAS = "cartas.csv"
ARCHIVO_MULTIPLICADORES = "multiplicadores.csv"
ARCHIVOS_IAS = {
    "facil": "ias_facil.csv",
    "normal": "ias_normal.csv",
    "dificil": "ias_dificil.csv"
}


COSTO_CURAR = 30
COSTO_REVIVIR_MULTIPLICADOR = 2.0  # Multiplicador del costo original de la carta
COSTO_REROLL = 50
COSTO_COMBINACION = 100


ORO_INICIAL = 500
MAX_CARTAS_MAZO = 5
MIN_CARTAS_TIENDA = 3
MAX_CARTAS_TIENDA = 5


CARTAS_INICIALES = [
    {
        "nombre": "Soldado",
        "tipo": "ataque",
        "ataque": 5,
        "defensa": 4,
        "vida": 10,
        "costo": 50
    },
    {
        "nombre": "Escudero",
        "tipo": "defensa",
        "ataque": 3,
        "defensa": 7,
        "vida": 12,
        "costo": 60
    },
    {
        "nombre": "Novato",
        "tipo": "ataque",
        "ataque": 4,
        "defensa": 3,
        "vida": 8,
        "costo": 40
    }
]
#PARA TESTEAR


CONFIG_DIFICULTAD = {
    "facil": {
        "num_ias": 1,
        "multiplicador_cartas": 0.8,
        "oro_recompensa_base": 100,
        "oro_recompensa_nivel": 50
    },
    "normal": {
        "num_ias": 3,
        "multiplicador_cartas": 1.0,
        "oro_recompensa_base": 100,
        "oro_recompensa_nivel": 50
    },
    "dificil": {
        "num_ias": 5,
        "multiplicador_cartas": 1.3,
        "oro_recompensa_base": 100,
        "oro_recompensa_nivel": 50
    }
}


DAMAGE_MINIMO = 1  # Daño mínimo que puede hacer un ataque
DIVISOR_DEFENSA = 2  # Divisor para calcular reducción de daño por defensa


# Umbrales para determinar estrategia de IA basada en sus stats
UMBRAL_ATAQUE_AGRESIVO = 70
UMBRAL_VELOCIDAD_AGRESIVO = 0.7
UMBRAL_PROB_ESPECIAL_MAGICO = 0.7
UMBRAL_VELOCIDAD_DEFENSIVO = 0.4
UMBRAL_ATAQUE_BERSERKER = 50
UMBRAL_PROB_ESPECIAL_BERSERKER = 0.5


CARTAS_BASE_POR_NIVEL = 3  # Número base de cartas, se suma el nivel
MULTIPLICADOR_ATAQUE_IA = 0.3  # Multiplicador del ataque base de la IA para cartas
MULTIPLICADOR_DEFENSA_IA = 0.25  # Multiplicador del ataque base de la IA para defensa de cartas
MULTIPLICADOR_VIDA_IA = 0.08  # Multiplicador de vida base de la IA para cartas
RANGO_ATAQUE_RANDOM = (5, 15)  # Rango aleatorio a sumar al ataque
RANGO_DEFENSA_RANDOM = (3, 12)  # Rango aleatorio a sumar a la defensa
RANGO_VIDA_RANDOM = (8, 20)  # Rango aleatorio a sumar a la vida
VARIACION_MIN = 0.7  # Variación mínima para stats de cartas de IA
VARIACION_MAX = 1.3  # Variación máxima para stats de cartas de IA


MIN_ATAQUE_CARTA = 5
MIN_DEFENSA_CARTA = 3
MIN_VIDA_CARTA = 8


BONUS_PROB_ESPECIAL_MIXTA = 10  # Bonus de probabilidad especial al combinar
MAX_PROB_ESPECIAL = 100  # Máximo de probabilidad especial
MULTIPLICADOR_VIDA_TROPA_EN_MIXTA = 0.5  # Fracción de vida de tropa que se suma a la mixta


TITULO_JUEGO = "🎮 JUEGO DE CARTAS DE COMBATE 🎮"
SEPARADOR = "=" * 50
SEPARADOR_CORTO = "=" * 40
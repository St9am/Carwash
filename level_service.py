def calc_level(exp: int) -> int:
    """
    Простая формула: 1 уровень = 100 exp
    Exp: 0–99 -> 0 lvl
    Exp: 100–199 -> 1 lvl
    ...
    """
    return exp // 100

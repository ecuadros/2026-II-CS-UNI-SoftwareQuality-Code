#!/usr/bin/env bash
# Crea un repositorio de practica con un historial de 12 commits en el que
# uno de ellos (el 7) introduce una regresion silenciosa.
# Creates a practice repository with a 12-commit history in which one commit
# (the 7th) introduces a silent regression.
#
# Uso / Usage:
#   bash crear-laboratorio.sh [directorio] [--lang es|en]
#
#   es (por defecto): directorio "laboratorio-notas", codigo y mensajes en espanol.
#   en:               directory "grades-lab", code and messages in English.
#
# El laboratorio sirve para practicar / The lab is for practicing:
#   1. git bisect run  -> encontrar el commit culpable de forma automatica / find the culprit commit
#   2. git reflog      -> recuperar trabajo tras un reset --hard accidental / recover from a bad reset
#   3. git revert      -> deshacer el commit culpable sin reescribir historia / undo it safely
set -euo pipefail

LANG_LAB="es"
DIR=""
while [ $# -gt 0 ]; do
  case "$1" in
    --lang)   LANG_LAB="${2:-}"; shift 2 ;;
    --lang=*) LANG_LAB="${1#*=}"; shift ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *)        DIR="$1"; shift ;;
  esac
done
case "$LANG_LAB" in
  es|en) ;;
  *) echo "--lang debe ser 'es' o 'en' / --lang must be 'es' or 'en'" >&2; exit 1 ;;
esac

# m "texto en espanol" "text in English"  -> devuelve el que corresponde al idioma elegido
m() { if [ "$LANG_LAB" = "en" ]; then printf '%s' "$2"; else printf '%s' "$1"; fi; }

# --- Nombres segun idioma -------------------------------------------------------
MOD=$(m notas grades)
TEST_MAIN=$(m test_notas test_grades)
TEST_PASS=$(m test_aprobado test_pass)
FN_FINAL=$(m nota_final final_grade)
FN_PASS=$(m aprobado is_passing)
FN_AVG=$(m promedio_practicas practice_average)
SCOPE=$(m notas grades)
A1=$(m ep mt);  A2=$(m ef fe);    A3=$(m p ca)                  # parametros iniciales / initial parameters
B1=$(m parcial midterm); B2=$(m final final); B3=$(m permanente continuous)  # tras el refactor / after refactor
DIR="${DIR:-$(m laboratorio-notas grades-lab)}"

# Python 3 puede llamarse python3 o python segun el sistema.
PY=""
for candidato in python3 python; do
  if "$candidato" -c "import sys; sys.exit(0 if sys.version_info[0] == 3 else 1)" >/dev/null 2>&1; then
    PY="$candidato"
    break
  fi
done
[ -n "$PY" ] || { echo "Se necesita Python 3 en el PATH. / Python 3 is required." >&2; exit 1; }

[ ! -e "$DIR" ] || { echo "'$DIR' ya existe / already exists." >&2; exit 1; }

git init --quiet -b main "$DIR"
cd "$DIR"
git config user.name  "$(m 'Estudiante Laboratorio' 'Lab Student')"
git config user.email "lab@example.com"
git config core.autocrlf false

commit() { git add -A && git commit --quiet -m "$1"; }

# 1 ---------------------------------------------------------------------------
cat > "$MOD.py" <<EOF
def $FN_FINAL($A1, $A2, $A3):
    """$(m 'Nota final del curso: NF = (EP + EF + P) / 3.' 'Final course grade: FG = (MT + FE + CA) / 3.')"""
    return ($A1 + $A2 + $A3) / 3
EOF
commit "feat($SCOPE): $(m 'agregar calculo de nota final' 'add final grade calculation')"

# 2 ---------------------------------------------------------------------------
cat > "$TEST_MAIN.py" <<EOF
import sys

from $MOD import $FN_FINAL

fallos = 0


def verificar(nombre, obtenido, esperado, tolerancia=0.001):
    global fallos
    if abs(obtenido - esperado) > tolerancia:
        print(f"$(m FALLA FAIL) {nombre}: $(m obtenido got)={obtenido} $(m esperado expected)={esperado}")
        fallos += 1


verificar("$FN_FINAL(13, 14, 16)", $FN_FINAL(13, 14, 16), 14.3333)

sys.exit(1 if fallos else 0)
EOF
commit "test($SCOPE): $(m 'agregar prueba de nota final' 'add final grade test')"

# 3 ---------------------------------------------------------------------------
printf '%s\n' "$(m '# Laboratorio de notas' '# Grades lab')" '' "$(m 'Ejercicio de practica para git bisect y git reflog.' 'Practice exercise for git bisect and git reflog.')" > README.md
commit "docs: $(m 'agregar README del laboratorio' 'add lab README')"
git tag -a v0.1.0 -m "$(m 'Primera version estable' 'First stable release')"

# 4 ---------------------------------------------------------------------------
cat >> "$MOD.py" <<EOF


def $FN_PASS(nota):
    """$(m 'Se aprueba con 10.5 o mas.' 'The pass mark is 10.5 or higher.')"""
    return nota >= 10.5
EOF
commit "feat($SCOPE): $(m 'agregar funcion aprobado' 'add pass check')"

# 5 ---------------------------------------------------------------------------
sed -i.bak "s/def $FN_FINAL($A1, $A2, $A3)/def $FN_FINAL($B1, $B2, $B3)/; s/($A1 + $A2 + $A3)/($B1 + $B2 + $B3)/" "$MOD.py"
rm -f "$MOD.py.bak"
commit "refactor($SCOPE): $(m 'renombrar parametros para que se entiendan' 'rename parameters for clarity')"

# 6 ---------------------------------------------------------------------------
printf '__pycache__/\n*.pyc\n' > .gitignore
commit "chore: $(m 'ignorar archivos generados por Python' 'ignore Python generated files')"

# 7  <-- LA REGRESION / THE REGRESSION ------------------------------------------
sed -i.bak "s|($B1 + $B2 + $B3) / 3|($B1 + $B2 + $B3) // 3|" "$MOD.py"
rm -f "$MOD.py.bak"
commit "perf($SCOPE): $(m 'usar division entera en nota_final' 'use integer division in final_grade')"

# 8 ---------------------------------------------------------------------------
cat >> "$MOD.py" <<EOF


def $FN_AVG(lista):
    """$(m 'Promedio simple de una lista de practicas.' 'Simple average of a list of practices.')"""
    return sum(lista) / len(lista)
EOF
commit "feat($SCOPE): $(m 'agregar promedio de practicas' 'add practice average')"

# 9 ---------------------------------------------------------------------------
printf '\n%s\n\n- %s\n- %s\n- %s\n' "$(m '## Funciones' '## Functions')" "$FN_FINAL" "$FN_PASS" "$FN_AVG" >> README.md
commit "docs: $(m 'listar las funciones disponibles' 'list the available functions')"

# 10 --------------------------------------------------------------------------
cat > "$TEST_PASS.py" <<EOF
from $MOD import $FN_PASS

assert $FN_PASS(10.5)
assert not $FN_PASS(10.4)
EOF
commit "test($SCOPE): $(m 'agregar prueba de aprobado' 'add pass check test')"

# 11 --------------------------------------------------------------------------
printf '\n' >> "$MOD.py"
commit "style: $(m 'agregar salto de linea final' 'add trailing newline')"

# 12 --------------------------------------------------------------------------
printf '\nVersion 0.2.0-dev\n' >> README.md
commit "chore: $(m 'marcar version de desarrollo' 'mark development version')"

echo
echo "$(m 'Laboratorio listo en' 'Lab ready at'): $(pwd)"
echo "$(m 'Commits creados' 'Commits created'):      $(git rev-list --count HEAD)"
echo "$(m 'Tag bueno conocido' 'Known-good tag'):   v0.1.0"
echo
echo "$(m 'Comprobacion rapida (debe fallar en HEAD)' 'Quick check (must fail on HEAD)'):"
"$PY" "$TEST_MAIN.py" && echo "  $(m pasa 'passes')" || echo "  $(m 'FALLA (esperado: hay una regresion escondida)' 'FAILS (expected: there is a hidden regression)')"
echo
echo "$(m 'Prueba ahora' 'Try it now'):"
echo "  cd $DIR"
echo "  git bisect start HEAD v0.1.0"
echo "  git bisect run $PY $TEST_MAIN.py"

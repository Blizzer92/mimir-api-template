# Mimir API

# Users

User the following credentials to test the application:

|Username|Password|Roles|
|--------|--------|-----|
|player|player|[player]|
|admin|admin|[admin]|
|tobi|buechel|[player, admin]|
|reto|kunz|[player, admin]|
|sven|sprey|[player, admin]|
|christoph|strube|[player, admin]|

# Remarks

Mit Tobi diskutiert Abweichungen von der Spezifikation:

- User-Role ist eine 1-n Beziehung.

Die findings aus Web2 wurden soweit möglich behoben.
Wir nehmen zur Kenntnis, dass ActionCreator.ts sehr schlecht skaliert und der Appstore nicht exportiert werden soll.
Dies zu beheben bedingt allerdings eine komplette Überarbeitung unserer Architektur und wurde deshalb so belassen. Gerne nehmen wir Feedback entegegen, wie so etwas sauber und skalierbar aufgebaut werden kann.

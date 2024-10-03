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

## Known Bugs:

- Die findings aus Web2 wurden soweit möglich behoben.
Wir nehmen zur Kenntnis, dass ActionCreator.ts sehr schlecht skaliert und der Appstore nicht exportiert werden soll.
Dies zu beheben bedingt allerdings eine komplette Überarbeitung unserer Architektur und wurde deshalb so belassen. Gerne nehmen wir Feedback entegegen, wie so etwas sauber und skalierbar aufgebaut werden kann.

- Refresh (F5) funktioniert auf allen Seiten, ausser auf editCard. Hier wird der von uns optional hinzugefügte loading state nie verlassen. Es ist die einzige Seite mit Parametern in der URL. Navigation mit navigate() funktioniert, Navigation im Browser über URL oder Refresh funktioniert nicht. Wir wären dir dankbar für Feedback warum das nicht geht und wie man das lösen könnt.

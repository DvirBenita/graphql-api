# GraphQL API for simulated embedded systems

We're expecting that embedded system we're simulating can communicate via HTTP. 

Simulated embedded system can be microcontrollers with a hall effect sensor at some building.
Embedded system POST data to our server when the positive or negative reading is captured.

[ESP32 Hall Effect Sensor](https://randomnerdtutorials.com/esp32-hall-effect-sensor/)
[What is Hall Sensor](https://se.rs-online.com/web/generalDisplay.html?id=ideas-and-advice/hall-effect-sensors-guide)
[How to read signals from a hall effect sensor](https://www.progressiveautomations.com/blogs/how-to/how-to-read-the-signal-from-a-hall-effect-sensor-using-an-arduino)

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
pip install foobar
```

## Usage

```python
import foobar

foobar.pluralize('word') # returns 'words'
foobar.pluralize('goose') # returns 'geese'
foobar.singularize('phenomena') # returns 'phenomenon'
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
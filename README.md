# GraphQL API for simulated embedded systems

We're expecting that embedded system we're simulating can communicate via HTTP. 

Simulated embedded system can be microcontrollers with a hall effect sensor at some building.
Embedded system POST data to our server when the positive or negative reading is captured.

[ESP32 Hall Effect Sensor](https://randomnerdtutorials.com/esp32-hall-effect-sensor/)\
[What is Hall Sensor](https://se.rs-online.com/web/generalDisplay.html?id=ideas-and-advice/hall-effect-sensors-guide)\
[How to read signals from a hall effect sensor](https://www.progressiveautomations.com/blogs/how-to/how-to-read-the-signal-from-a-hall-effect-sensor-using-an-arduino)\
[ESP32 Video streaming and face recognition](https://randomnerdtutorials.com/esp32-cam-video-streaming-face-recognition-arduino-ide/)

## Installation

```bash
docker-compose up
```

## Usage

### Example query requests

#### request

```graphql
query {
  people{
    email
    firstName
    lastName
    department
    age
  }
}
```

#### response

```json
{
  "data": {
    "people": [
      {
        "email": "martin.albert@gmail.com",
        "firstName": "Martin",
        "lastName": "Albert",
        "department": "IT",
        "age": 21
      }
    ]
  }
}
```

#### request

```graphql
query {
  readings {
    timestamp
    date
    value
  }
}
```

```json
{
  "data": {
    "readings": [
      {
        "timestamp": 1591790202799,
        "date": "Wed, 10 Jun 2020 11:56:42 GMT",
        "value": -15
      },
      {
        "timestamp": 1591790192799,
        "date": "Wed, 10 Jun 2020 11:56:32 GMT",
        "value": 44
      },
      {
        "timestamp": 1591790172828,
        "date": "Wed, 10 Jun 2020 11:56:12 GMT",
        "value": 47
      }
    ]
  }
}
```

#### request

```graphql
query {
  scans {
    timestamp
    date
    email
    status
  }
}
```

```json
{
  "data": {
    "scans": [
      {
        "timestamp": 1591790272747,
        "date": "Wed, 10 Jun 2020 11:57:52 GMT",
        "email": "peter.albert@gmail.com",
        "status": "verified"
      },
      {
        "timestamp": 1591790282754,
        "date": "Wed, 10 Jun 2020 11:58:02 GMT",
        "email": "martin.albert@gmail.com",
        "status": "not verified"
      }
    ]
  }
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

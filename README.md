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

After docker container will successfully run. Go to 
[localhost/graphql](http://localhost:3000/graphql) 
and try some of the queries described below.

Simulation container is sending POST requests with reading and scan object every 10 seconds, so just wait a bit to get some response.

[GET](#people-query-request)\
[CREATE](#people-create-request)\
[DELETE](#people-delete-request)

### Example query requests

#### people query Request

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

#### people query Response

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

#### reading query Request

```graphql
query {
  readings {
    timestamp
    date
    value
  }
}
```

#### reading query Response

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

#### scan query Request

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

#### scan query Response

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

#### people create Request

```graphql
mutation {
  createPerson(
    email: "martin.albert@gmail.com"
    firstName: "Martin"
    lastName: "Albert"
    department: "IT"
    age: 21
  ) {
    email
    firstName
    lastName
    department
    age
  }
}
```

#### people create Response

```json
{
  "data": {
    "createPerson": {
      "email": "martin.albert@gmail.com",
      "firstName": "Martin",
      "lastName": "Albert",
      "department": "IT",
      "age": 21
    }
  }
}
```

#### reading create Request

```graphql
mutation {
  createReading(timestamp: "1191242229353", value: -124) {
    timestamp
    date
    value
  }
}
```

#### reading create Response

```json
{
  "data": {
    "createReading": {
      "timestamp": 1191242229343,
      "date": "Mon, 01 Oct 2007 12:37:09 GMT",
      "value": -124
    }
  }
}
```

#### scan create Request

```graphql
mutation {
  createScan(
    timestamp: "1111246022353",
    email: "martin.albert@gmail.com",
    status: "verified"
  ){
    timestamp
    date
    email
    status
  }
}
```

#### scan create Response

```json
{
  "data": {
    "createScan": {
      "timestamp": 1111246022353,
      "date": "Sat, 19 Mar 2005 15:27:02 GMT",
      "email": "martin.albert@gmail.com",
      "status": "verified"
    }
  }
}
```

#### people delete Request
##### single delete

```graphql
mutation {
  deletePerson(email: "martin.albert@gmail.com")
}
```

##### delete all

```graphql
mutation {
  deleteAllPeople
}
```

#### people delete Response

```json
{
  "data": {
    "deletePerson": true
  }
}
```
```json
{
  "data": {
    "deleteAllPeople": true
  }
}
```

#### reading delete Request
##### single delete

```graphql
mutation {
  deleteReading(timestamp: "1191242229343")
}
```

##### delete all

```graphql
mutation {
  deleteAllReadings
}
```

#### reading delete Response

```json
{
  "data": {
    "deleteReading": true
  }
}
```
```json
{
  "data": {
    "deleteAllReadings": true
  }
}
```

#### scan delete Request
##### single delete

```graphql
mutation {
  deleteScan(timestamp: "1111246022353")
}
```

##### delete all

```graphql
mutation {
  deleteAllScans
}
```

#### scan delete Response

```json
{
  "data": {
    "deleteReading": true
  }
}
```
```json
{
  "data": {
    "deleteScan": true
  }
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

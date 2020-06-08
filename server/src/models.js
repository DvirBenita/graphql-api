
let readingsList = {
    1591643927103: {
        timestamp: new Date(1591643927103),
        date: new Date(1591643927103).toUTCString(),
        reading: 25
    },
    1591644336681: {
        timestamp: new Date(1591644336681),
        date: new Date(1591644336681).toUTCString(),
        reading: -100
    }
}

let peopleList = {
    'martin.albert@gmail.com': {
        email: 'martin.albert@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: 21
    },
    'peter.albert@gmail.com': {
        email: 'peter.albert@gmail.com',
        firstName: 'Peter',
        lastName: 'Albert',
        department: 'Civil Engineering',
        age: 25
    },
}

module.exports = {
    readingsList: readingsList,
    peopleList: peopleList
}
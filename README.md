# random-user-generator [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Random user generator using the randomuser.me services. It can be a single user or an array and outputs to the console or a file.


## Install

```sh
$ npm install --save random-user-generator
```


## Usage

```js
var RandomUserGenerator = require('random-user-generator');
var rug = new RandomUserGenerator();

rug.getOne(function (user) {
  console.log(user);
});
```

## API

### getOne

Returns one random user.

*options* (optional): Specifies a list of options (see section options)
*cb*: A callback function that executes after the user was created.  The parameter for the callback is the single user object

### getMany

Returns an array of random users.

*howMany*: Specifies the number of users to return.
*options* (optional): Specifies a list of options (see section options)
*cb*: A callback function that executes after the user was created.  The parameter for the callback is the single user object

## Options
These are the options that you can pass either to the constructor or to the individual get* call.

### fields
Specifies the list of fields that the returned users should have out of the default list of fields provided by randomuser.me

```js
randomUserGenerator.getOne({fields: ["name", "email"]}, function (user) {
  console.log(user); 
  /**
   * Outputs 
   * {
   *   name: 
   *     {first: "allan", last: "collins", title: "mr"},
   *   email: "allan.collins@example.com"
   * }
   **/
});
```

### map
Creates a map for the fields to be returned.

```js
randomUserGenerator.getOne({
  map: {
      firstName: "name.first",
      email: "email",
      telephone: "phone"
    }
  }, function (user) {
    console.log(user); 
    /**
    * Outputs 
    * {
    *   firstName: "allan",
    *   email: "allan.collins@example.com",
    *   telephone: "04-3108-4901"
    * }
    **/
});
```

### writeToFile
If set to anything different than false, this will generate a file using the string passed as a parameter as the file name.

### seed
Specify a seed to pass in the query paramter (see http://randomuser.me/documentation for details)

### nationality
Specify a nationality to pass in the query paramter (see http://randomuser.me/documentation for details)

### gender
Specify a gender to pass in the query paramter (see http://randomuser.me/documentation for details)

## License

MIT © [Joel Lord](http://www.github.com/joellord)


[npm-image]: https://badge.fury.io/js/random-user-generator.svg
[npm-url]: https://npmjs.org/package/random-user-generator
[travis-image]: https://travis-ci.org/joellord/random-user-generator.svg?branch=master
[travis-url]: https://travis-ci.org/joellord/random-user-generator
[daviddm-image]: https://david-dm.org/joellord/random-user-generator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/joellord/random-user-generator
[coveralls-image]: https://coveralls.io/repos/joellord/random-user-generator/badge.svg
[coveralls-url]: https://coveralls.io/r/joellord/random-user-generator

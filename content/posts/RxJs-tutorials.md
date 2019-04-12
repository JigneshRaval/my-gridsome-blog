# RxJs Tutorials and Tips

## what is RxJS ?

- It is a JavaScript implementation of the ReactiveX library – a library for composing asynchronous and event-based programs by using observable sequences.
- ReactiveX itself is an abstraction of library that you can use on different platforms and with different languages.
- In addition to RxJS, ReactiveX has implementations in several other most popular languages.
- For the full list refer to the languages page on the official website.

> RxJS lets us use asynchronous operations that usually return a single value in combination with streams (or events). And we know that streams and events in most of the cases produce values constantly. And they let us do that in a nice, fluid and composable way with tons of operators available out of the box.

### A stream can also complete, which means that:

- the stream has ended its lifecycle without any error
- after completion, the stream will not emit any further values

### As an alternative to completion, a stream can also error out, which means that:

- the stream has ended its lifecycle with an error
- after the error is thrown, the stream will not emit any other values

### Notice that completion or error are mutually exclusive:

- if the stream completes, it cannot error out afterwards
- if the streams errors out, it cannot complete afterwards

Notice also that there is no obligation for the stream to complete or error out, those two possibilities are optional. But only one of those two can occur, not both.

This means that when one particular stream errors out, we cannot use it anymore, according to the Observable contract. You must be thinking at this point, how can we recover from an error then?

## Pillars of RxJS

Three key players in RxJS are:

- **Producer** : Producer is the source of values for the observable. It can be an array, iterator, web socket, events, etc.

- **Observable** : Observable is basically a link between Producer and Observer.

> An observable is just a function. This function takes in an observer as an argument, and returns a subscription object.

- **Observer** : Observable will notice Observer whenever Producer has new values to send.

An *observer* is just an object with three methods:

- next which takes in a value
- error which takes in an error message and
- complete with has no arguments.

This is what a standard (logging) observer looks like:

```javascript
{
  next(value) {
    console.log(value);
  },
  error(err) {
    console.error(err);
  },
  complete() {
    console.info('done');
  }
}
```

When an `Observable` produces a value, it lets the observer know by calling `next` on the produced value, or `error` when a problem occurs.

This communication between the `observable` and the `observer` can terminate in two different ways:

- The observer (consumer of values) decides it’s no longer interested in receiving more values and it therefore unsubscribes from the observable by calling the `unsubscribe` function returned upon subscription.
- The observable (producer of values) has no more values to send, and informs the observer by calling `complete` on it.

## A synchronous Observable example: Rx.Observable.from

Let’s try to recreate the following behaviour provided out of the box by RxJS. We’ll create an observable that returns synchronously and immediately five values over time, and then completes.

```javascript
const numbers$ = Rx.Observable.from([0, 1, 2, 3, 4]);

numbers$.subscribe(
  (value) => console.log(value),
  (err) => console.error(err),
  () => console.info('done')
);
```

## Simple Error Handling in RxJS

https://alligator.io/rxjs/simple-error-handling/

Creating complex observable pipelines is all good, but how do you effectively handle errors within them? Let’s go over some of the basics here with the `catch`, `finally`, `retry` and `retryWhen` operators.

### Observer’s Error Callback

At its most basic, observers take an error callback to receive any unhandled errors in an observable stream. For example, here our observable fails and an error message is printed to the console:

```javascript
const obs$ = Rx.Observable
  .interval(500)
  .map(value => {
    if (value > 3) {
      throw new Error('too high!');
    } else {
      return value;
    }
  });

obs$.subscribe(value => {
  console.log(value);
},
err => {
  console.error('Oops:', err.message);
},
() => {
  console.log(`We're done here!`);
});

// OUTPUT
0
1
2
3
Oops: too high!
```

### The Catch Operator

Having unhandled errors propagated to the observer should be a last resort, because we can use the catch operator to deal with errors as they happen in the stream. Catch should return another observable or throw again to be handled by the next catch operator or the observer’s error handler if there’s no additional catch operator.

Here, for example, we return an observable of the value 3:

```javascript
const obs$ = Rx.Observable
  .interval(500)
  .map(value => {
    if (value > 3) {
      throw new Error('too high!');
    } else {
      return value;
    }
  })
  .catch(error => {
    return Rx.Observable.of(3);
  });

obs$.subscribe(value => {
    console.log(value);
  },
  err => {
    console.error('Oops:', err.message);
  },
  () => {
    console.log(`We're done here!`);
  });

// OUTPUT
0
1
2
3
3
We're done here!
```

> A stream can have as many catch operators as needed, and it's often a good idea to have a catch close to a step in the stream that might fail.

If you want the stream to just complete without returning any value, you can return an empty observable:

```javascript
.catch(error => {
  return Rx.Observable.empty();
})
```

Alternatively, if you want the observable to keep hanging and prevent completion, you can return a never observable:

```javascript
.catch(error => {
  return Rx.Observable.never();
})
```

#### Returning the source observable

**Catch** can also take a 2nd argument, which is the source observable. If you return this source, the observable will effectively restart all over again and retry:

```javascript
const obs$ = Rx.Observable
  .interval(500)
  .map(value => {
    if (value > 3) {
      throw new Error('too high!');
    } else {
      return value;
    }
  })
  .catch((error, source$) => {
    return source$;
  });

// OUTPUT
0
1
2
3
0
1
2
3
0
1
2
3
...
```

> You'll want to be careful and only return the source observable when errors are intermittent. Otherwise if the stream continues failing you'll create an infinite loop. For more flexible retrying mechanisms, see below about retry and retryWhen

### Finally

You can use the finally operator to run an operation no matter if an observable completes successfully or errors-out. This can be useful to clean-up in the case of an unhandled error. The callback function provided to finally will always run. Here’s a simple example:

```javascript
const obs$ = Rx.Observable
  .interval(500)
  .map(value => {
    if (value > 3) {
      throw new Error('too high!');
    } else {
      return value;
    }
  })
  .finally(() => {
    console.log('Goodbye!');
  });

obs$.subscribe(value => {
  console.log(value);
},
err => {
  console.error('Oops:', err.message);
},
() => {
  console.log(`We're done here!`);
});

// OUTPUT
0
1
2
3
Oops: too high!
Goodbye!
```

### Retrying

#### The `retry` operator

You can use the retry operator to `retry` an observable stream from the beginning. Without an argument, it will retry indefinitely, and with an argument passed-in, it’ll retry for the specified amount of times.

> In the following example, we `retry` 2 times, so our observable sequence runs for a total of 3 times before finally propagating to the observer’s error handler:

```javascript
const obs$ = Rx.Observable
  .interval(500)
  .map(value => {
    if (value > 3) {
      throw new Error('too high!');
    } else {
      return value;
    }
  })
  .retry(2)


obs$.subscribe(value => {
  console.log(value);
},
err => {
  console.error('Oops:', err.message);
},
() => {
  console.log(`We're done here!`);
});

// OUTPUT
0
1
2
3
0
1
2
3
0
1
2
3
Oops: too high!
```

You can also add a `catch` right after a `retry` to catch an error after a retry was unsuccessful:

```javascript
.retry(1)
.catch(error => {
  return Rx.Observable.of(777);
});

// OUTPUT
0
1
2
3
0
1
2
3
777
We're done here!
```

#### The retryWhen operator

Using the `retry` operator is all well and good, but often we want to retry fetching data from our backend, and if it just failed, we probably want to give it a little time before retrying again and taxing the server unnecessarily. The `retryWhen` operator allows us to do just that. `retryWhen` takes an observable of errors, and you can return that sequence with an additional delay to space-out the retries.

Here we wait for 500ms between retries:

```javascript
const obs$ = Rx.Observable
  .interval(500)
  .map(value => {
    if (value > 3) {
      throw new Error('too high!');
    } else {
      return value;
    }
  })
  .retryWhen(error$ => {
    return error$.delay(500);
  });
```

The above code will retry forever if the error keep happening. To retry for a set amount of times, you can use the scan operator to keep track of how many retries have been made and throw the error further down the chain if the amount of retries exceeds a certain number.

Here on the 4th retry, we’ll give up and let the error propagate to the observer:

```javascript
const obs$ = Rx.Observable
  .interval(500)
  .map(value => {
    if (value > 3) {
      throw new Error('too high!');
    } else {
      return value;
    }
  })
  .retryWhen(error$ => {
    return error$.scan((count, currentErr) => {
      if (count > 3) {
        throw currentErr;
      } else {
        return count += 1;
      }
    }, 0);
  });
```

## RxJS: Subjects, Behavior Subjects & Replay Subjects

https://alligator.io/rxjs/subjects/

> A subject in Rx is a special hybrid that can act as both an observable and an observer at the same time. This way, data can be pushed into a subject and the subject’s subscribers will in turn receive that pushed data.

Subjects are useful for multicasting or for when a source of data is not easily transformed into an observable. It’s easy to overuse subjects and oftentimes, as illustrated in this excellent post, subjects can be avoided when an observable source can be created otherwise.

On top of vanilla subjects, there are also a few specialized types of subjects like `async subjects`, `behavior subjects` and `replay subjects`. In this post, we’ll introduce **subjects**, **behavior subjects** and **replay subjects**.

### Using Subjects

Creating a subject is as simple as newing a new instance of RxJS’s Subject:

```
const mySubject = new Rx.Subject();
```

Multiple subscriptions can be created and internally the subject will keep a list of subscriptions:

```
const mySub = mySubject.subscribe(x => console.log(`${x} ${x}`));
const mySub2 = mySubject.subscribe(x => console.log(x.toUpperCase()));
```

Data can be pushed into the subject using its `next` method:

```javascript
mySubject.next('👋 Hello!');

// 👋 Hello! 👋 Hello!
// 👋 HELLO!
```

When data is pushed into a subject, it’ll go through its internal list of subscriptions and next the data into each one.

#### Simple example

Here’s an example that demonstrates how data gets is pushed to the subscriptions:

```javascript
const mySubject = new Rx.Subject();

mySubject.next(1);

const subscription1 = mySubject.subscribe(x => {
  console.log('From subscription 1:', x);
});

mySubject.next(2);

const subscription2 = mySubject.subscribe(x => {
  console.log('From subscription 2:', x);
});

mySubject.next(3);

subscription1.unsubscribe();

mySubject.next(4);

// OUTPUT
From subscription 1: 2
From subscription 1: 3
From subscription 2: 3
From subscription 2: 4
```

Note how subscriptions that arrive late are missing out on some of the data that’s been pushed into the subject. We’ll see how to manage that below with `Behavior Subjects` or `Replay Subjects`.

#### Error and Completion

When a subject completes or errors out, all the internal subscriptions also complete or error out:

```javascript
const mySubject = new Rx.Subject();

const sub1 = mySubject.subscribe(null, err =>
  console.log('From sub1:', err.message)
);

const sub2 = mySubject.subscribe(null, err =>
  console.log('From sub2:', err.message)
);

mySubject.error(new Error('Oh nooo!'));

// From sub1: Oh nooo!
// From sub2: Oh nooo!
```

#### Multicasting

The real power of subjects comes into play with multicasting, where a subject is passed as the observer to an observable, which will mean that, when the observable emits, the data is multicasted to all of the subject’s subscriptions:

Here’s an example where a trickleWords observable emits a word every 750ms.

```javascript
const mySubject = new Rx.Subject();
const words = ['Hot Dog', 'Pizza', 'Hamburger'];

const trickleWords = Rx.Observable.zip(
  Rx.Observable.from(words),
  Rx.Observable.interval(750),
  word => word
);

const subscription1 = mySubject.subscribe(x => {
  console.log(x.toUpperCase());
});

const subscription2 = mySubject.subscribe(x => {
  console.log(
    x
      .toLowerCase()
      .split('')
      .reverse()
      .join('')
  );
});

trickleWords.subscribe(mySubject);
Here’s the printed result after all the values have been emitted:

HOT DOG
god toh
PIZZA
azzip
HAMBURGER
regrubmah
```

#### asObservable

The `asObservable` operator can be used to transform a subject into an observable. This can be useful when you’d like to expose the data from the subject, but at the same time prevent having data inadvertently pushed into the subject:

```javascript
const mySubject = new Rx.Subject();
const myObs = mySubject.asObservable();

mySubject.next('Hello');
myObs.next('World!'); // TypeError: myObs.next is not a function
```

### Replay Subjects

As you saw previously, late subject subscriptions will miss out on the data that was emitted previously. Replay subjects can help with that by keeping a buffer of previous values that will be emitted to new subscriptions.

Here’s a usage example for replay subjects where a buffer of 2 previous values are kept and emitted on new subscriptions:

```javascript
const mySubject = new Rx.ReplaySubject(2);

mySubject.next(1);
mySubject.next(2);
mySubject.next(3);
mySubject.next(4);

mySubject.subscribe(x => {
  console.log('From 1st sub:', x);
});

mySubject.next(5);

mySubject.subscribe(x => {
  console.log('From 2nd sub:', x);
});

// Here’s what that gives us at the console:

From 1st sub: 3
From 1st sub: 4
From 1st sub: 5
From 2nd sub: 4
From 2nd sub: 5
```

### Behavior Subjects

Behavior subjects are similar to replay subjects, but will re-emit only the last emitted value, or a default value if no value has been previously emitted:

```javascript
const mySubject = new Rx.BehaviorSubject('Hey now!');

mySubject.subscribe(x => {
  console.log('From 1st sub:', x);
});

mySubject.next(5);

mySubject.subscribe(x => {
  console.log('From 2nd sub:', x);
});
And the result:

From 1st sub: Hey now!
From 1st sub: 5
From 2nd sub: 5
```

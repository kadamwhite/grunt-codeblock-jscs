# Failing Codeblocks

```javascript
// codeblock one: 2 errors
var message = "Wrong type of quote marks";

var wEiRd_CaSe = 'Camel-snakes are dangeroues'

undefinedFunctionIsUndefined();
```

```js
// Another codeblock: 1 error
if ( 'we compare with null with not-threequals' == null ) {
  console.log( 'this will fail' );
}
```

```html
<script>
  var message = [
    'since this is html, this will',
    'not be evaluated and the missing',
    'semi-colon will (still) not be caught'
  ]
</script>
```

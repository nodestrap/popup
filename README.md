# &lt;Popup&gt;&lt;/Popup&gt;
A generic element with dynamic visibility (show/hide).

## Preview

```jsx
<Popup tag='div' theme='primary' size='lg' gradient={true} outlined={true} active={true} >
    hello world
</Popup>
```
Rendered to:
```html
<div class="c1 thPrimary szLg gradient outlined actived">
    hello world
</div>
```

## Features
* Includes all features in [`<Indicator />`](https://www.npmjs.com/package/@nodestrap/indicator).
* `active`/`passive` state. `active={true}` to show, `active={false}` to hide.
* Customizable via [`@cssfn/css-config`](https://www.npmjs.com/package/@cssfn/css-config).

## Installation

Using npm:
```
npm i @nodestrap/popup
```

## Support Us

If you feel our lib is useful for your projects,  
please make a donation to avoid our project from extinction.

We always maintain our projects as long as we're still alive.

[[Make a donation](https://ko-fi.com/heymarco)]

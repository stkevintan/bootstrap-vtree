# bootstrap-vtree
A simple treeview for bootstrap

## Snapshot
![snapshot](https://raw.githubusercontent.com/stkevintan/bootstrap-vtree/master/snapshot/sample.png)
## Feature
+ Lightweight && Easy to learn
+ Lazyload


## Usage
### Preparation
Include following static file to your project:
- `vtree.js`
- `vtree.css`

add a wrapper for vtree  
```html
<div class="tree-box"></div>
```

init bootstrap-vtree  
```js
const CONFIG = {
    lazyLoad: true,
    xhrConf: {
        type: 'GET',
        url: '/getTree',
        dataType: 'json'
    },
    loadingImg: 'assets/static/loading.gif',
    types: {
        section: {
            icon: 'glyphicon glyphicon-home',
            action: {
                defaultName: '显示人员',
                activeName: '隐藏人员',
                event: function($elem, state) {
                    let $collect = $elem.children('ul').children('li[data-type!="section"]');
                    if (state === this.defaultName) {
                        $collect.show();
                    } else {
                        $collect.hide();
                    }
                }
            }
        },
        staff: {
            icon: 'glyphicon glyphicon-user'
        }
    }
}

let vtree = $('.tree-box').vtree(Samples, CONFIG);
```

### Methods
```js
function methodsExamples() {
    //reload node(id=2) from server
    vtree.load({
        id: 2
    }, function() {
        console.log('done');
    });

    //search 'xxx' from server(parameter:keyword)
    vtree.load({
        keyword: 'xxx'
    }, function() {
        console.log('done');
    });
    //build a tree or subtree from a specific JSON data 
    vtree.build(Samples);

    //expand node(id=4)
    vtree.expandNode(4, function() {
        console.log('done');
    });

    //collapse node(id=2)
    vtree.collapseNode(2);
}
```

Enjoy!

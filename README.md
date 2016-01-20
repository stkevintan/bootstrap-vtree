# bootstrap-vtree
A simple treeview for bootstrap

## Snapshot
![snapshot](https://raw.githubusercontent.com/stkevintan/bootstrap-vtree/master/snapshot/sample.png)



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
var Samples = {
    rootId: 0, //默认0
    nodes: [
        {
            text: `item-${++fakename}`,
            type: 'section',
            url: 'www.baidu.com',
            isExpanded: true,
            nodes: [
                {
                    url: 'http://www.baidu.com',
                    text: `item-${++fakename}`,
                    type: 'section'
                },
                {
                    url: 'http://www.baidu.com',
                    text: `item-${++fakename}`,
                    type: 'staff',
                    isLeaf: true
                }
            ]
        },
        {
            url: 'http://www.baidu.com',
            text: `item-${++fakename}`,
            type: 'staff',
            isLeaf: true
        }
    ]
}

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
            btn: {
                defaultName: 'showStaffs',
                activeName: 'hideStaffs',
                handler: function(id, action) {
                    /**
                    * callback function to excute after user clicked this button
                    * @param {string} id - the identify of this node
                    * @param {SwitchAction} [action=0|1] - the action name, 0:OFF or 1:ON
                    **/
                    console.log(id, action ? 'ON' : 'OFF');
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

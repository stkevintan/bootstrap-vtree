# bootstrap-vtree
A simple treeview for bootstrap

## Snapshot
![snapshot](https://raw.githubusercontent.com/stkevintan/bootstrap-vtree/master/snapshot/sample.png)
## Feature
+ Lightweight && Easy to learn
+ Lazyload


## Usage
Include following static file:
- `vtree.js`
- `vtree.css`

```html
<div class="tree-box"></div>
```

```js

const sample = [{
    id:'tr-1',
    text: 'item-1',
    nodes: [{
        id:'tr-2',
        text: 'item-2',
        type: 'section',
        nodes: [{
            id:'tr-4',
            text: 'item-4',
            isLeaf:true
        }]
    },
        {
            id:'tr-3',
            text: 'item-3',
            type: 'staff',
            isLeaf: true
        }]
}];

const vtree = $(.tree-box).vtree(sample,{
    loadingImg: 'assets/static/loading.gif',
    types:{
        section:{
            icon: 'glyphicon glyphicon-home'
        },
        staff:{
            icon: 'glyphicon glyphicon-home'
        }
    }
});

///lazyLoad
const vtree_lazyload = $('.tree-box').vtree({
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
                defaultName: '隐藏人员',
                activeName: '显示人员',
                event: function($elem, state) {
                    let $collect = $elem.children('ul').children('li[data-type!="section"]');
                    if (state === this.defaultName) {
                        $collect.hide();
                    } else {
                        $collect.show();
                    }
                }
            }
        },
        staff: {
            icon: 'glyphicon glyphicon-user'
        }
    }
});
    
//methods
const subTree = {
    rootId:'tr-2',
    nodes:[{
        text:'item-5',
        isLeaf:true
    }]
}
const newXhrConf = {
    type:'GET',
    url:'/getTree2',
    dataType:'json'
}
const $nodes = $('.vtree li[data-type=section]');

//rebuild a subtree with new data
vtree.build(subTree); 

//reload the subtree of node 'tr-2' with new ajax settings
vtree_lazyload.load('tr-2',newXhrConf,() => {
  console.log('done');
});

//expand all nodes
vtree.expandNode($nodes,() => {
  console.log('done');
});

//collapse all nodes
vtree.collapseNode($nodes);
```

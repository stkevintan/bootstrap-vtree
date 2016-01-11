(function($) {
    let tree = {};
    let idCounter = 0;
    let $elem = undefined;
    let defaultOpts = {
        lazyLoad: false,
        types: {
            default: {
                icon: 'glyphicon glyphicon-home'
            }
        },
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down'
    };
    let userOpts = {};

    function logError() {
        if (typeof console !== 'undefined') {
            console.log('[treeview]: ', ...arguments);
        }
    }
    function init(elem, opts) {
        $elem = $(elem);
        $elem.addClass('vtree');
        $.extend(true, userOpts, defaultOpts, opts);
    }

    function render(cur, $cur) {
        if (!Array.isArray(cur.nodes) || cur.nodes.length === 0) {
            return;
        }
        let $ul = $(document.createElement('ul'));
        $ul.addClass('list-unstyled tree-group');
        for (let node of cur.nodes) {
            node.id = node.id || (++idCounter);
            if (!userOpts.types.hasOwnProperty(node.type)) {
                node.type = 'default';
            }
            let $li = $(document.createElement('li'));
            $li.addClass('tree-group-item');
            $li.attr('data-id', node.id);
            $li.attr('data-type', node.type);
            let ctrl = '';
            if (!node.isLeaf) {
                ctrl = `<span class="${userOpts.expandIcon} expand-icon"></span>
                        <span class="${userOpts.collapseIcon} collapse-icon"></span>`
            }
            $li.html(`<div class='item-content'>
                ${ctrl}
                <span class="${userOpts.types[node.type].icon} "></span>
                ${node.text}
                </div>`);
            if (userOpts.types[node.type].hasOwnProperty('action')) {
                let $btn = $(document.createElement('button'));
                $btn.addClass('btn btn-default');

                $btn.text(userOpts.types[node.type].action.defaultName);
                $li.children('.item-content').prepend($btn);
            }
            $ul.append($li);
            //dfs
            render(node, $li);
        }
        $cur.append($ul[0]);
    }

    function build(data) {
        data.rootId = data.rootId || 0;
        let $root = $elem;
        if (data.rootId) {
            $root = $elem.find(`[data-id=${data.rootId}]`);
            if ($root.length === 0) {
                logError('cannot find tree root', `{id:${data.rootId}}`);
                return;
            }
        }
        $root.children('ul').remove();
        render(data, $root);
    }
    /**
    * @param id {integer} - resource's id
    * @param settings {object} - ajax settings object
    */
    function load(id = 0, settings = userOpts.xhrConf, cb) {
        let $img = $(document.createElement('img'));
        $img.attr('src', userOpts.loadingImg);
        if (id === 0) {
            $elem.children('ul').fadeOut();
            userOpts.loadingImg && $elem.before($img);
        } else {
            userOpts.loadingImg &&
            $elem.find(`li[data-id=${id}]  span.collapse-icon`).eq(0).after($img);
        }
        $.ajax($.extend({}, settings, {
            data: {
                id
            }
        })).done((data) => {
            build(data);
        }).fail((XMLHttpRequest) => {
            logError(XMLHttpRequest.status + ': ' + XMLHttpRequest.responseText);
        }).always(() => {
            $img.remove();
            $elem.children('ul').fadeIn();
            cb && cb();
        });
    }
    function expandNode($li, cb) {
        $li.addClass('expanded');
        let $subul = $li.children('ul');
        if ($subul.length === 0 || $subul.children('li').length === 0) {
            if (typeof cb === 'function') {
                load($li.data('id'), userOpts.xhrConf, cb);
            } else {
                load($li.data('id'));
            }
        } else {
            cb && cb();
        }
    }
    function collapseNode($li) {
        $li.removeClass('expanded');
    }
    function bind() {
        //bind event
        $elem.on('click', 'span.expand-icon', function() {
            expandNode($(this).closest('li'))
        });

        $elem.on('click', 'span.collapse-icon', function() {
            collapseNode($(this).closest('li'));
        });

        $elem.on('click', 'button', function() {
            let $self = $(this);
            let $li = $self.closest('li');
            if (!$li.hasClass('expanded')) {
                expandNode($li, doAction);
            } else {
                doAction();
            }
            function doAction() {
                let type = $li.data('type');
                userOpts.types[type].action.event($li, $self.text());
                if ($self.text() === userOpts.types[type].action.defaultName) {
                    $self.text(userOpts.types[type].action.activeName);
                } else {
                    $self.text(userOpts.types[type].action.defaultName);
                }
            }
        });
    }

    $.fn['vtree'] = function(data, opts) {
        if (this.length === 0) return;
        if (typeof opts === 'undefined') {
            opts = data;
            data = {};
        }
        init(this[0], opts);
        if (userOpts.lazyLoad) {
            load();
        } else {
            build(data);
        }
        bind();
        return {
            load,
            build,
            expandNode,
            collapseNode
        };
    }
})(jQuery);

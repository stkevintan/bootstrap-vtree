(function($) {
    let tree = {};
    let idCounter = 0;
    let $elem = undefined;
    /**
    * Enum Switch States
    * @enum {string}
    **/
    const SwitchAction = {
        ON: 1,
        OFF: 0
    }
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
            if (node.isExpanded) $li.addClass('expanded');
            let ctrl = '';
            if (!node.isLeaf) {
                ctrl = `<span class="${userOpts.expandIcon} expand-icon"></span>
                        <span class="${userOpts.collapseIcon} collapse-icon"></span>`
            }
            $li.html(`<div class='item-content'>
                ${ctrl}
                <span class="${userOpts.types[node.type].icon} "></span>
                <a href='${node.url ? node.url : 'javascript:void(0)'}'>${node.text}</a>
                </div>`);
            if (userOpts.types[node.type].hasOwnProperty('btn')) {
                let $btn = $(document.createElement('button'));
                $btn.addClass('btn btn-default');
                $btn.text(userOpts.types[node.type].btn.defaultName);
                $li.children('.item-content').prepend($btn);
            }
            $ul.append($li);
            //dfs
            render(node, $li);
        }
        $cur.append($ul[0]);
    }
    // 根据data建树
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
        adjustLine();
    }
    /**
    * @param params {object} - ajax请求的参数
    * @param cb {function} - callback function
    */

    function load(params = {}, cb) {
        let $img = $(document.createElement('img'));
        $img.attr('src', userOpts.loadingImg);
        if (!params.hasOwnProperty('id')) {
            params.id = 0;
        }
        if (params.id === 0) {
            $elem.children('ul').fadeOut();
            userOpts.loadingImg && $elem.before($img);
        } else {
            userOpts.loadingImg &&
            $elem.find(`li[data-id=${params.id}]  span.collapse-icon`).eq(0).after($img);
        }

        $.ajax($.extend({}, userOpts.xhrConf, {
            data: params
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
    function adjustLine($ul = $elem.find('ul')) {
        var $li = $ul.children('li:visible').last();
        $li.addClass('last-child').siblings().removeClass('last-child');
    }
    function expandNode($li, cb) {
        if ($li.hasClass('expanded')) {
            cb && cb();
            return;
        }
        $li.addClass('expanded');
        if (userOpts.lazyLoad === false) {
            cb && cb();
            return;
        }
        let $subul = $li.children('ul');
        if ($subul.length === 0 || $subul.children('li').length === 0) {
            load({
                id: $li.data('id')
            }, cb);
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
            expandNode($li, function() {
                let type = $li.data('type');
                const ACTION = ($self.text() === userOpts.types[type].btn.defaultName ? SwitchAction.ON : SwitchAction.OFF);
                userOpts.types[type].btn.handler.call(this, $li.data('id'), ACTION);
                switch (ACTION) {
                    case SwitchAction.ON:
                        $self.text(userOpts.types[type].btn.activeName);
                        $li.addClass('active');
                        break;
                    case SwitchAction.OFF:
                        $self.text(userOpts.types[type].btn.defaultName);
                        $li.removeClass('active');
                        break;
                }
                adjustLine($li.children('ul'));
            });
        });
    }

    $.fn['vtree'] = function(data, opts) {
        if (this.length === 0) return;
        if (typeof opts === 'undefined') {
            opts = data;
            data = {};
        }
        init(this[0], opts);
        build(data);
        if (userOpts.lazyLoad && data == {}) {
            load();
        }
        bind();
        return {
            load,
            build,
            expandNode: function(id, cb) {
                const $li = $(`li[data-id=${id}]`, $elem);
                expandNode($li, cb);
            },
            collapseNode: function() {
                const $li = $(`li[data-id=${id}]`, $elem);
                collapseNode($li);
            }
        };
    }
})(jQuery);

// ==UserScript==
// @name         DeepWiki 汉化插件
// @namespace    https://github.com/TC999/deepwiki-chinese
// @version      1.0
// @description  DeepWiki 汉化插件，DeepWiki 中文化界面，增加翻译项前后空格检查和完全匹配功能
// @author       陈生杂物房
// @match        *://deepwiki.org/*
// @match        *://deepwiki.com/*
// @grant        none
// @license      GPL-3
// @icon         https://deepwiki.org/favicon.ico
// ==/UserScript==

(function () {
    'use strict';

    // 定义替换规则
    const replacements = {
        // 顶部
        "powered by": "驱动",
        "Share": "分享",
        "Link copied!": "链接已复制",
        "Copied to clipboard": "已复制到剪切板",
        // 中间
        "Which repo would you like to understand?": "您想了解什么仓库？",
        "What is DeepWiki?": "什么是 DeepWiki？",
        "DeepWiki provides up-to-date documentation you can talk to, for every repo in the world. Think Deep Research for GitHub.": "DeepWiki 为全球每一个代码仓库提供最新的、可交互文档。将其视为专为 GitHub 打造的深度研究工具。",
        "Search for repositories (or paste a link)": "搜索仓库（或粘贴链接）",

        "Add repo": "添加仓库",
        "Add Repository": "添加仓库",
        "Public Repository": "公共仓库",
        "Search for a GitHub repository": "搜索 GitHub 仓库",
        "Enter the URL of a public GitHub repository": "键入 GitHub 公共仓库链接",
        "Private Repository": "私有仓库",
        "Set up my private repo on Devin": "在 Devin 上设置我的私有仓库",
        // 未导入仓库
        "stars": "星标",
        "Updated:": "更新于：",
        "Repository Not Indexed": "未编入索引",
        "This repository hasn't been indexed yet. Indexing allows you to explore code structure, find documentation, and understand dependencies.": "该代码仓库尚未建立索引。索引功能可帮助您探索代码结构、查找文档并理解项目依赖关系。",
        "Indexing typically takes 2-10 minutes to complete after it starts indexing": "索引通常在开始后需要 2 到 10 分钟完成。",
        "Index Repository": "索引仓库",
        "Once indexed, you'll have full access to code exploration and search functionality": "建立索引后，您即可全面使用代码探索和搜索功能。",

        "Indexing in Progress": "索引中",
        "The indexing process typically takes 2-10 minutes to complete": "索引编制过程通常需要 2-10 分钟完成",
        "We'll notify you at": "我们将通知",
        "once indexing is complete": "当索引完成",
        // 某仓库 wiki
        "Last indexed:": "最后索引：",
        "Auto-refresh not enabled yet": "自动刷新尚未启用",
        "Add a badge to this wiki in the repo's README file to auto refresh the wiki weekly with the latest code.": "在仓库的 README 文件中为此 Wiki 页面添加徽章，以实现每周自动使用最新代码更新 Wiki 内容。",
        "Create badge": "创建徽章",
        "Try DeepWiki on your private codebase with": "在您的私有代码库上试用 DeepWiki，使用",

        "Relevant source files": "相关源文件",

        "On this page": "此页面",

        "Deep Research": "深度思考",

        // gpt 问答页
        "Fast": "快速",
        "Go deeper": "深度思考",
        "Deep": "深度",
        "Thinking...": "思考中...",
    };

    // 定义正则替换规则
    const regexReplacements = [
        [/Search(?:ed|ing) across (\S+)/i, "搜索自 $1"],
        [/Ask Devin about (\S+)/i, "询问 Devin 关于 $1"],
        [/Your repository is queued for indexing. You are number (\d+) in the queue./i, "您的仓库正在排队索引。当前队列：$1"],
        // 日期
        [/(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/, function(all, d, m ,y) {
            const months = {
                "January": "1月", "February": "2月", "March": "3月", "April": "4月",
                "May": "5月", "June": "6月", "July": "7月", "August": "8月",
                "September": "9月", "October": "10月", "November": "11月", "December": "12月"
            };
            return `${y}年${months[m]}${d}日`;
        }],
    ];

    const processedFlag = 'data-text-processed';

    // 删除字符串前后空格并完全匹配替换
    function trimAndReplace(text, key, value) {
        const trimmedKey = key.trim();
        if (text === trimmedKey) {
            return value;
        }
        return text;
    }

    // 替换文字函数
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!node.parentElement || node.parentElement.getAttribute(processedFlag)) return;

            let textContent = node.textContent.trim();
            let replaced = false;
            let replacedRegex = false;

            for (let key in replacements) {
                if (replacements.hasOwnProperty(key)) {
                    const newText = trimAndReplace(textContent, key, replacements[key]);
                    if (newText !== textContent) {
                        textContent = newText;
                        replaced = true;
                    }
                }
            }

            for (let [regex, replacement] of regexReplacements) {
                if (regex.test(textContent)) {
                    textContent = textContent.replace(regex, replacement);
                    replacedRegex = true;
                }
            }

            if (replaced || replacedRegex) {
                console.log("Before:", node.textContent);
                console.log("After:", textContent);
                node.textContent = textContent;
                node.parentElement.setAttribute(processedFlag, "true");
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceText);
        }
    }

    function processDocument() {
        replaceText(document.body);
    }

    document.documentElement.lang = "zh";

    processDocument();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    replaceText(node);
                });
            } else if (mutation.type === 'characterData') {
                replaceText(mutation.target);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
    });
})();
// ==UserScript==
// @name         DeepWiki 汉化插件
// @namespace    https://github.com/TC999/deepwiki-chinese
// @version      1.0
// @description  DeepWiki 汉化插件，DeepWiki 中文化界面
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
    };

    // 定义一个已处理标记，避免重复处理节点
    const processedFlag = 'data-text-processed';

    // 替换文字函数
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // 检查是否替换过
            if (!node.parentElement || node.parentElement.getAttribute(processedFlag)) return;

            let textContent = node.textContent;
            let replaced = false; // 标记是否有替换发生

            for (let key in replacements) {
                if (replacements.hasOwnProperty(key) && textContent.includes(key)) {
                    textContent = textContent.split(key).join(replacements[key]);
                    replaced = true;
                }
            }

            // 仅在发生替换的情况下更新内容
            if (replaced) {
                node.textContent = textContent;
                node.parentElement.setAttribute(processedFlag, "true");
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 如果是元素节点，递归处理子节点
            node.childNodes.forEach(replaceText);
        }
    }

    // 处理整个文档的替换
    function processDocument() {
        replaceText(document.body);
    }

    // 修改网页语言为中文
    document.documentElement.lang = "zh";

    // 初始化替换
    processDocument();

    // 监听动态变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replaceText(node);
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        replaceText(node);
                    }
                });
            } else if (mutation.type === 'characterData') {
                replaceText(mutation.target);
            }
        });
    });

    // 开始监听，仅监听 body 节点
    observer.observe(document.body, {
        childList: true, // 监听子节点的增加或删除
        characterData: true, // 监听节点内容或文本的变化
        subtree: true // 递归监听子树中的所有节点
    });
})();
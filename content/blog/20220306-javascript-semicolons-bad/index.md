---
published: true
title: Javascript Semicolons are Bad, Actually
date: 2022-03-06
description: I’ve been lured into the no-semicolon club. I didn’t expect to be convinced, but I had missed a truly compelling argument.
tags:
  - JavaScript
  - code-style
banner: ./js-bad.png
---

I’ve been lured into the no-semicolon club. I didn’t expect to be convinced, but I had missed a truly compelling argument.

Let’s start with some background to illustrate why this debate even exists.

## ASI

**automatic semicolon insertion** is the well-defined (but oft confusing) process by which a JavaScript parser interprets \n as being the end of a statement.

### Rules

Taken from a description by Isaac Schlueter (and quoted on this [eslint ](https://eslint.org/docs/rules/no-unexpected-multiline)rule):
>  *a newline character always ends a statement, just like a semicolon, except where one of the following is true:*
>  *- The statement has an unclosed paren, array literal, or object literal or ends in some other way that is not a valid way to end a statement. (For instance, ending with . or ,.)
- The line is --or ++ (in which case it will decrement/increment the next token.)
- It is a for(), while(), do, if(), or else, and there is no {
- The next line starts with [, (, +, *, /, -, ,, ., or some other binary operator that can only be found between two tokens in a single expression.*

## ASI Hazards

**ASI hazards** are scenarios where automatic semicolon insertion causes behavior that would be unexpected to the programmer. The prototypical example of this is

    // Ex. unintendedMultiline
    var a = {}

    (function(){
       // function code
    })()

You might expect this to be execute the function on line 3, but line 1 was never terminated. Instead, it will attempt to call {} with function(){...} and then call the return as a function. The result is a runtime error with an error message seemingly unrelated to the code changes.

## The illusion of safety

In the past, I’ve been told that when it comes to semicolons in JavaScript, “better to be safe than sorry.” This presupposes that:
>  *using semicolons will prevent you from having bugs related to ASI*

**Is this statement true?**
I’m not sure it is. Will using semicolons in every location where you would like a statement to end, prevent a statement from ending when you did not intend?

**No.** *for counter example*, this function will always return undefined

    unintentionalSingleLineASIHazard(name) {
    return 
    `\
    long templated string that
    that you want to return that contains ${name}
    `; }

ASI Hazards still exist for developers who use semicolons every time they *intend* to end a statement. This demonstrates the importance of understanding ASI for JavaScript Developers, even if they diligently use semicolons.

It would seem that even if you’re “safe” you can still be “sorry.”

## Can linting save us?

### EsLint Semi: ‘error’, ‘always’

let’s look at how our two examples above interact with a common eslint rule.

*unintendedMultiline***
**if you run eslint against the unintendedMultiline example above, these are the errors:
>  3:1 — no-unexpected-multiline
>  5:5 — Missing Semicolon

running eslint --fix produces

    // ignores ambiguous ending
    var a = {}

    (function(){
       // function code
    })() ;

*unintendedSingleLine***
**if you run eslint against the *unintendedSingleLine *example above, these are the errors:
>  2:7 — Missing semicolon.

running eslint --fix produces

    unintendedSingleLine(name) {
    return ;
    `\
    long templated string that
    that you want to return that contains ${name}
    `; }

The result is an error that is masked by the linter and might make its way into production.

### EsLint Semi: ‘error’, ‘never’

Alternatively, let’s look at how the scenarios above behave when semicolons are not allowed

*unintendedMultiline***
**if you run eslint against the unintendedMultiline example above, these are the errors:
>  *3:1 — no-unexpected-multiline*

none of the issues are fixable.

*unintendedSingleLine***
**if you run eslint against the unintendedSingleline example above, there are no errors.

With this rule, the programmer is required to understand the behaviors of ASI, but the inability to use semicolons requires more frequent use and understanding of this required knowledge.

## Conclusions

ASI cannot be ignored — even by programmers who do use semicolons.

A developer can still run into ASI hazards while using semicolons; you cannot arbitrarily break a line like you can in Java/C++; and ambiguity will always exist between a programmer that intended a multiline statement and one that simply forgot a semicolon.

My primary takeaway is: **it’s more valuable to write code that lacks ambiguity in-spite of ASI than to spend time adding semicolons to guard against it.**

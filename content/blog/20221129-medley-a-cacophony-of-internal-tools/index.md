---
published: false
construction: true
title: A cacophonous syphony of internal tools
date: 2022-11-29
description: With limited time and budget, how do you make effective cross-platform internal tooling?
tags:
  - internal-tooling
---

## Composing a better solution

Status: **Unimplemented**

I propose "Medley", a composable, flexible tool designed for teams and designed to be owned by teams.

### Project Goals

#### Versioning

multiple versions should not be maintained, like your live infrastructure, there is only one copy. The tool should
auto-update, and the only differentiation that should be provided is what *update stream* is being used. To see how
this could work in practice, you could create a series of update streams.

- `local` : (local) the version that you maintain on your machine while testing. This is your personal copy, there is only one.
- `danger`: a testing branch used to evaluate large, breaking changes.
- `latest` : this is what most should be using.
- `lastweek` : (local) the last version you had before updating. saved with the settings it had at that time.

feature flags should be used to test out new changes/features whenever possible, with the `danger` distribution as a last resort.
the framework should make it easy for you to feature flag functionality.

#### single executable

you should be able to get started by just passing around a single executable. The single executable should be able to:

- build a medley project
- produce its own source code
- execute without admin permissions (with warnings)
- rely on as few system dependencies as possible
- help the user add functionality to the tool
- help the user contribute their changes back

#### consistent

The tool should be hostile to version skew and inconsistent execution. A command typed on one machine should do 
the same thing on another.

- tools should behave consistently from machine to machine
- version skew should be the exception (and the user should know about it)
- customization can be achieved through extension? (maybe your dev copy could use local customization files?)

### Project structure

```
mixer/ # built first, either with go *or* mixer
medley/ # build with `mixer build medley`
```

### `mixer` 

`mixer` is used to build the rest of your project and as such cannot rely on libraries from elsewhere
in your project (although *it* may be referenced by other projects).

to build mixer, you must have a working go build environment and then run:
```
cd ./mixer
go generate ./...
go build -o medley-mixer .
```

once you've built `medley` you can rebuild both `mixer` and `medley` by running `medley build`.

### `medley` command

If you use the `mixer` generator, then medley will contain the `medley mixer` command which will be equivalent to
`go run ./mixer`

### `medley build`

medley build will be equivalent to:
```
cd ./mixer
go generate ./...
go build -o medley-mixer .
mv ./medley-mixer <replace old medley-mixer>
cd ../medley
medley mixer build .
mv ./medley <replace old medley>
```

### python? embed it.

It should be possible to embed scripts in medley and cross-call between. as much as possible, medley should ignore
anything on the system that it doesn't explicitly look for. The python mixin will provide an installation of python
that doesn't include pip, and includes only libraries asked for by the build system. Think like a custom version of
python-minimal.

https://www.ardanlabs.com/blog/2020/07/extending-python-with-go.html

https://github.com/kluctl/go-embed-python

### extension

any extensions will utilize grpc to communicate with the main medley process. 

### Repository

!TODO code splitting should be possible, not sure how...
maybe we should abuse go-mod to optimize some of this?

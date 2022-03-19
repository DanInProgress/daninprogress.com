---
published: false
title: Kubernetes in Slomo
date: 2022-03-18
description: 
tags:
  - kubernetes
  - k8s
---

## Basic Talk

Kubernetes isn't magic.

kubernetes at its **very** simplest is a standard set of extensible APIs to start, track, and stop the execution of containers running on a set of computers. Nothing more, nothing less.

So lets take a look at a common task in kubernetes and talk about it.

Deploying hello world.

What just happened?

1. dc sees deployment
1. dc updates deployment
1. dc creates rs
1. rsc sees rs, updates rs, creates p
1. sched sees p, assigns host, 
1. kubelet sees p 


## Tutorial I want to emulate

https://kubernetes.io/docs/tutorials/_print/#pg-5e3051fff9e84735871d9fb5e7b93f33


```sh
# first kubectl command:
kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
```

## Throwing together some useful links:

[DeploymentController]

Adding event handlers: https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/deployment/deployment_controller.go#L121

blog post expanding on replicaset controller:
https://medium.com/@madhavpandey33/understanding-kubernetes-replicaset-controller-f6ec896fb23f

ReplicaSetController:
https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/replicaset/replica_set.go#L82

interesting comment about hacky behavior:
https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/replicaset/replica_set.go#L177

[DeploymentController]: https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/deployment/deployment_controller.go



controller manager leader election: https://kube.academy/courses/the-kubernetes-machine/lessons/controller-manager

## Notes from talk with eris

kube-proxy should probably be called out.


next questiosn? how does traffic get into the cluster



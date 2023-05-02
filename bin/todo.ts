#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TodoStack } from "../lib/todo-stack";
import { initStack } from "./init-stack";
const { app, stackNameWithEnv, stackProps, context } = initStack();

const todoStack = new TodoStack(app, stackNameWithEnv, context, stackProps);

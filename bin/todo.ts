#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TodoStack } from "../lib/todo-stack";
const app = new cdk.App();
const todoStack = new TodoStack(app, "TodoStack");

import * as assert from "assert";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import {Environment} from '../../environment';
import * as sinon from 'sinon';
import { LightExtension } from "../../types";

// import * as myExtension from './extension';

suite("Test environment", () => {
  vscode.window.showInformationMessage("Start environment tests.");
  class GlobalStateMock {
    public value = '';
    public update(key: string, value: any): Thenable<void> {
      this.value = value;
      return new Promise((resolve, reject) => {
        return {};
      });
    }
  }
  class ContextMock implements LightExtension {
    public globalState: GlobalStateMock;
    public globalStorageUri;
    constructor(globalState: GlobalStateMock) {
      this.globalStorageUri = vscode.Uri.parse('file:///home/user/.vscode/', true);
      this.globalState = globalState;

    }
  }

  const globalState = sinon.spy<GlobalStateMock>(<any>'_update');
  const contextMock = new ContextMock(globalState);
  
  test("check getGlobalStorageStateDbFile", async () => {
    const env = new Environment(contextMock); 
    assert.equal(env.getGlobalStorageStateDbFile(), 'test');
  });
});

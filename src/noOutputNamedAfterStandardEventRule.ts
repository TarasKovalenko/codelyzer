import * as Lint from 'tslint';
import * as ts from 'typescript';
import { sprintf } from 'sprintf-js';
import { NgWalker } from './angular/ngWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-output-named-after-standard-event',
    type: 'maintainability',
    description: 'Disallows naming directive outputs after a standard DOM event.',
    rationale: 'Listeners subscribed to an output with such a name will also be invoked when the native event is raised.',
    options: null,
    optionsDescription: 'Not configurable.',
    typescriptOnly: true,
  };

  static FAILURE_STRING: string = 'In the class "%s", the output ' +
    'property "%s" should not be named after a standard event.';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new OutputMetadataWalker(sourceFile,
        this.getOptions()));
  }
}


export class OutputMetadataWalker extends NgWalker {
  // source: https://developer.mozilla.org/en-US/docs/Web/Events
  private readonly standardEventNames = new Map([
    ['abort', true],
    ['afterprint', true],
    ['animationend', true],
    ['animationiteration', true],
    ['animationstart', true],
    ['appinstalled', true],
    ['audioprocess', true],
    ['audioend', true],
    ['audiostart', true],
    ['beforeprint', true],
    ['beforeunload', true],
    ['beginEvent', true],
    ['blocked', true],
    ['blur', true],
    ['boundary', true],
    ['cached', true],
    ['canplay', true],
    ['canplaythrough', true],
    ['change', true],
    ['chargingchange', true],
    ['chargingtimechange', true],
    ['checking', true],
    ['click', true],
    ['close', true],
    ['complete', true],
    ['compositionend', true],
    ['compositionstart', true],
    ['compositionupdate', true],
    ['contextmenu', true],
    ['copy', true],
    ['cut', true],
    ['dblclick', true],
    ['devicechange', true],
    ['devicelight', true],
    ['devicemotion', true],
    ['deviceorientation', true],
    ['deviceproximity', true],
    ['dischargingtimechange', true],
    ['DOMAttributeNameChanged', true],
    ['DOMAttrModified', true],
    ['DOMCharacterDataModified', true],
    ['DOMContentLoaded', true],
    ['DOMElementNameChanged', true],
    ['focus', true],
    ['focusin', true],
    ['focusout', true],
    ['DOMNodeInserted', true],
    ['DOMNodeInsertedIntoDocument', true],
    ['DOMNodeRemoved', true],
    ['DOMNodeRemovedFromDocument', true],
    ['DOMSubtreeModified', true],
    ['downloading', true],
    ['drag', true],
    ['dragend', true],
    ['dragenter', true],
    ['dragleave', true],
    ['dragover', true],
    ['dragstart', true],
    ['drop', true],
    ['durationchange', true],
    ['emptied', true],
    ['end', true],
    ['ended', true],
    ['endEvent', true],
    ['error', true],
    ['fullscreenchange', true],
    ['fullscreenerror', true],
    ['gamepadconnected', true],
    ['gamepaddisconnected', true],
    ['gotpointercapture', true],
    ['hashchange', true],
    ['lostpointercapture', true],
    ['input', true],
    ['invalid', true],
    ['keydown', true],
    ['keypress', true],
    ['keyup', true],
    ['languagechange', true],
    ['levelchange', true],
    ['load', true],
    ['loadeddata', true],
    ['loadedmetadata', true],
    ['loadend', true],
    ['loadstart', true],
    ['mark', true],
    ['message', true],
    ['messageerror', true],
    ['mousedown', true],
    ['mouseenter', true],
    ['mouseleave', true],
    ['mousemove', true],
    ['mouseout', true],
    ['mouseover', true],
    ['mouseup', true],
    ['nomatch', true],
    ['notificationclick', true],
    ['noupdate', true],
    ['obsolete', true],
    ['offline', true],
    ['online', true],
    ['open', true],
    ['orientationchange', true],
    ['pagehide', true],
    ['pageshow', true],
    ['paste', true],
    ['pause', true],
    ['pointercancel', true],
    ['pointerdown', true],
    ['pointerenter', true],
    ['pointerleave', true],
    ['pointerlockchange', true],
    ['pointerlockerror', true],
    ['pointermove', true],
    ['pointerout', true],
    ['pointerover', true],
    ['pointerup', true],
    ['play', true],
    ['playing', true],
    ['popstate', true],
    ['progress', true],
    ['push', true],
    ['pushsubscriptionchange', true],
    ['ratechange', true],
    ['readystatechange', true],
    ['repeatEvent', true],
    ['reset', true],
    ['resize', true],
    ['resourcetimingbufferfull', true],
    ['result', true],
    ['resume', true],
    ['scroll', true],
    ['seeked', true],
    ['seeking', true],
    ['select', true],
    ['selectstart', true],
    ['selectionchange', true],
    ['show', true],
    ['soundend', true],
    ['soundstart', true],
    ['speechend', true],
    ['speechstart', true],
    ['stalled', true],
    ['start', true],
    ['storage', true],
    ['submit', true],
    ['success', true],
    ['suspend', true],
    ['SVGAbort', true],
    ['SVGError', true],
    ['SVGLoad', true],
    ['SVGResize', true],
    ['SVGScroll', true],
    ['SVGUnload', true],
    ['SVGZoom', true],
    ['timeout', true],
    ['timeupdate', true],
    ['touchcancel', true],
    ['touchend', true],
    ['touchmove', true],
    ['touchstart', true],
    ['transitionend', true],
    ['unload', true],
    ['updateready', true],
    ['upgradeneeded', true],
    ['userproximity', true],
    ['voiceschanged', true],
    ['versionchange', true],
    ['visibilitychange', true],
    ['volumechange', true],
    ['waiting', true],
    ['wheel', true]
  ]);

  visitNgOutput(property: ts.PropertyDeclaration, output: ts.Decorator, args: string[]) {
    let className = (<any>property).parent.name.text;
    let memberName = (<any>property.name).text;

    if (memberName && this.standardEventNames.get(memberName)) {
      const failureConfig: string[] = [Rule.FAILURE_STRING, className, memberName];
      const errorMessage = sprintf.apply(null, failureConfig);
      this.addFailure(
        this.createFailure(
          property.getStart(),
          property.getWidth(),
          errorMessage
        )
      );
    }
  }
}

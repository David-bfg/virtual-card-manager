import React, { useState, useRef } from "react";

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonToggle,
  IonRange,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

function CardEditor() {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // do stuff
  };

  const [spendingLimit, setSpendingLimit] = useState(0);
  const ionLimitInputEl = useRef<HTMLIonInputElement>(null);

  const onLimitInput = (ev: Event) => {
    const value = (ev.target as HTMLIonInputElement).value as string;
    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    setSpendingLimit(numericValue);

    const inputCmp = ionLimitInputEl.current;
    if (inputCmp !== null) {
      inputCmp.value = dollarMask(numericValue);
    }
  };

  const dollarMask = (spendingLimit: number) => {
    const value = Math.floor(spendingLimit).toString();
    if (value == "0") return "";
    const mask = ["$ "];

    if (value.length < 3) {
      mask.push("0.");
      for (let index = 0; index < 2 - value.length; index++) {
        mask.push("0");
      }
      for (let index = 0; index < value.length; index++) {
        mask.push(value[index]);
      }
    } else {
      for (let index = 0; index < value.length; index++) {
        const remain = value.length - index;
        mask.push(value[index]);

        if (!(remain % 3)) {
          if (remain == 3) {
            mask.push(".");
          } else {
            mask.push(",");
          }
        }
      }
    }
    return mask.join("");
  };

  return (
    <IonCard>
      <div>CardEditor</div>
      <IonCardContent>
        <form onSubmit={onSubmit}>
          <IonItem>
            <IonInput
              label="Card Name"
              labelPlacement="floating"
              placeholder="name"
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonRange
              labelPlacement="start"
              label="Tax"
              ticks={true}
              snaps={true}
              min={8}
              max={24}
              pin={true}
              pinFormatter={(value: number) => `${(value / 2).toFixed(1)}%`}
            >
              <IonToggle slot="end"></IonToggle>
            </IonRange>
          </IonItem>

          <IonItem>
            <IonInput
              label="Spending Limit"
              labelPlacement="floating"
              placeholder="$ 0.00"
              value={dollarMask(spendingLimit)}
              onIonInput={onLimitInput}
              ref={ionLimitInputEl}
              maxlength={10}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonSelect label="Spending Limit Period" labelPlacement="floating">
              <IonSelectOption value="MONTHLY">Monthly</IonSelectOption>
              <IonSelectOption value="ANNUALLY">Annually</IonSelectOption>
              <IonSelectOption value="TRANSACTION" disabled={true}>
                Each Transaction
              </IonSelectOption>
              <IonSelectOption value="FOREVER" disabled={true}>
                Card Lifetime
              </IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonSelect label="Card State" labelPlacement="floating">
              <IonSelectOption value="OPEN">Open</IonSelectOption>
              <IonSelectOption value="PAUSED">Paused</IonSelectOption>
              <IonSelectOption value="CLOSED" disabled={true}>
                Closed
              </IonSelectOption>
              {/* TODO: have a better way to close a card or explicitly say do it from lithic dashboard */}
            </IonSelect>
          </IonItem>

          <div className="ion-margin-top">
            <IonButton fill="clear" style={{ float: "left" }}>
              Cancel
            </IonButton>
            <IonButton fill="clear" style={{ float: "right" }}>
              Reset
            </IonButton>
            <IonButton fill="clear" style={{ float: "right" }}>
              Apply
            </IonButton>
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
}

export default CardEditor;

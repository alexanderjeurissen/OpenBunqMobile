import React from 'react';
import { useRecoilState, RecoilState } from 'recoil';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import ObjType from '../types/obj_type';


interface SegmentFilterProps extends React.FC {
  segments: {
    value: string;
    label: string;
  }[];
  filter: RecoilState<unknown>;
  key: string;
}
const SegmentFilter: React.FC<SegmentFilterProps> =  ({ segments, filter, key }) => {
  const [ filterState, setFilterState ] = useRecoilState(filter);
  return (
    <IonSegment
      value={(filterState as ObjType)[key]}
      onIonChange={e => {
        setFilterState({
          ...(filterState as ObjType),
          [key]: e.detail.value || ''
        })
      }}>
      { segments.map(({ value, label}) => (
      <IonSegmentButton value={value}>
        <IonLabel>{label}</IonLabel>
      </IonSegmentButton>
      ))}
    </IonSegment>
  )
}

export default SegmentFilter;

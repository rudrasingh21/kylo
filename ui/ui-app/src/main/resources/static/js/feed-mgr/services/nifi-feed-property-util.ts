import * as _ from "underscore"
import {Templates} from "../../../lib/feed-mgr/services/TemplateTypes";
import Property = Templates.Property;
import Processor = Templates.Processor;

export class NifiFeedPropertyUtil{


    /**
     * If the property is sensitive we should store off the long encrypted value and show just asterisks
     * @param property
     */
    public static initSensitivePropertyForEditing(property:Property):void{
        if(property.sensitive && !this.isMasked(property.value)){
            property.encryptedValue = property.value;
            if(property.value != null) {
                property.value = '******';
            }
        }
    };
    /**
     * Return true if every char in value == '*'
     */
    public static  isMasked(value:any):boolean{
        return value != null && _.every(value.split(''),(char)=>{
            return char == '*';
        });
    };
    /**
     * If the property is sensitive and hasnt changed we should set it back to the encrypted value.
     * @param property
     */
   public static  initSensitivePropertyForSaving(property:Property):void{
        if(property.sensitive){
            if(NifiFeedPropertyUtil.isMasked(property.value)){
                property.value = property.encryptedValue;
            }
            //reset it
            delete property.encryptedValue;
        }
    };

    public static   initSensitivePropertiesForEditing(properties:Property[]) :void{
        if(properties && properties.length) {
            _.each(properties,  (prop) => {
                NifiFeedPropertyUtil.initSensitivePropertyForEditing(prop);
            });
        }

    };

    /**
     * Sets the displayValue attribute for the incoming property
     * @param property a NiFiProperty
     */
    public static updateDisplayValue(property:Property):void {
        property.displayValue = property.value;
        if (property.key == "Source Database Connection" && property.propertyDescriptor != undefined && property.propertyDescriptor.allowableValues) {
            var descriptorOption = _.find(property.propertyDescriptor.allowableValues,  (option:Property) => {
                return option.value == property.value;
            });
            if (descriptorOption != undefined && descriptorOption != null) {
                property.displayValue = descriptorOption.displayName;
            }
        }
    }

    /**
     * Update the property display values for the list of processors
     * @param processors a list of processors that have a list of properties
     */
    public static  updateDisplayValueForProcessors(processors:Processor[]):void{
        if(processors && processors.length) {
            _.each(processors,  (processor) =>{
                if (processor.properties) {
                    _.each(processor.properties,  (property)=>{
                        NifiFeedPropertyUtil.updateDisplayValue(property);
                    })
                }
            });
        }
    }

}

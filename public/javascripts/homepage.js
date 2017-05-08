import d3 from "d3";
import {create_species_dropdown, autocomplete_species} from "./species-selector";

//** species_dt from species-list-info.js
//** make species dropdown_menu
create_species_dropdown('#species-selector', species_dt);
//** setup and render autocomplete for species
autocomplete_species();

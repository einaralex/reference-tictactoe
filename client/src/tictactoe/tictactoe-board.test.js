import TictactoeBoardModule from './TictactoeBoard';
import ReactDOM from 'react-dom';
import React from 'react';
import { shallow } from 'enzyme';

import TicCellComponent from './TicCell';

import MessageRouter from '../common/framework/message-router';

describe("Tic Cell", function () {

var div, component, TicCell;

var commandRouter = MessageRouter(inject({}));
var eventRouter = MessageRouter(inject({}));
var commandsReceived=[];

commandRouter.on("*", function(cmd){
    commandsReceived.push(cmd);
} );

beforeEach(function () {
    commandsReceived.length=0;
    TicCell = TicCellComponent(inject({
        generateUUID:()=>{
            return "youyouid"
        },
        commandPort: commandRouter,
        eventRouter
    }));

    div = document.createElement('div');

    component = shallow(<TicCell />, div);

});

it('should render without error', function () {

});

it('should record move with matching game id and coordinates ',function(){
});

it('should ignore move with matching gameId but not coordinates',function(){
});

it('should ignore move with matching coordinates, but not matching gameId',function(){
});

it('should issue PlaceMove command with gameId, mySide and coordinates when clicked', ()=>{
    component.find('div').simulate('click');

    // check whether correct command was dispatched through command router
});

});

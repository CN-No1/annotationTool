<template>
  <div class="wrapper">
    <div class="text-list">
      <div
        class="text-item"
        v-for="(i, index) in textList"
        @click="changeText(i, index)"
        :style="{ color: i.labeled.length > 0 ? 'green' : 'white' }"
      >
        {{ index + 1 }}、{{ i.text }}
      </div>
    </div>
    <div class="annotation-wrapper">
      <div class="annotation">
        <el-popover
          placement="top-start"
          title="材料"
          width="800"
          trigger="hover"
          :content="questionText || '无'"
        >
          <div class="question" slot="reference">Q: {{ question }}</div>
        </el-popover>
        <div class="label-wrapper">
          <span
            class="label"
            v-for="i in labels"
            :style="{ background: i.color }"
            @click="annotate(i)"
            >{{ i.name }}</span
          >
        </div>
        <div class="text-data" @click="getSelection" v-html="text"></div>
        <div class="btns-left">
          <el-button
            circle
            plain
            icon="el-icon-caret-left"
            @click="pre"
          ></el-button>
        </div>
        <div class="btns-right">
          <el-button
            circle
            plain
            icon="el-icon-caret-right"
            @click="next"
          ></el-button>
        </div>
      </div>
      <div class="record">
        <el-table
          :data="tableData"
          style="width: 85%;margin:auto;"
          @cell-mouse-enter="rowHover"
          @cell-mouse-leave="rowHoverLeave"
          max-height="750"
        >
          <el-table-column prop="text" label="文本" width="200">
          </el-table-column>
          <el-table-column
            prop="label"
            label="标签"
            :filters="filters"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag close-transition>{{ scope.row.label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click.native.prevent="deleteRow(scope)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Annotate extends Vue {
  private textTemp: string =
    '原告佡某诉称，要求与被告离婚，夫妻感情已破裂。经审理查明，原、被告于1988年自由恋爱相识，1990年6月登记结婚，婚生一男孩龚某某，婚后初期夫妻感情尚可，后因家庭琐事产生矛盾，导致夫妻感情不和，故原告于2014年3月18日起诉来院。本院认为，婚姻关系的存续应以夫妻感情为基础。原、被告系自主婚姻，婚后双方虽因家庭生活琐事争吵，但并未导致夫妻感情彻底破裂。原告应珍惜来之不易的夫妻感情，考虑家庭及子女的长远利益，放弃离婚念头；被告亦应积极做夫妻和好工作，努力克服自己的缺点和不足，多关心体贴爱人。只要双方多做自我批评、互解互谅，共建美满幸福家庭是完全可能的。';
  private text: string =
    '原告佡某诉称，要求与被告离婚，夫妻感情已破裂。经审理查明，原、被告于1988年自由恋爱相识，1990年6月登记结婚，婚生一男孩龚某某，婚后初期夫妻感情尚可，后因家庭琐事产生矛盾，导致夫妻感情不和，故原告于2014年3月18日起诉来院。本院认为，婚姻关系的存续应以夫妻感情为基础。原、被告系自主婚姻，婚后双方虽因家庭生活琐事争吵，但并未导致夫妻感情彻底破裂。原告应珍惜来之不易的夫妻感情，考虑家庭及子女的长远利益，放弃离婚念头；被告亦应积极做夫妻和好工作，努力克服自己的缺点和不足，多关心体贴爱人。只要双方多做自我批评、互解互谅，共建美满幸福家庭是完全可能的。';
  get filters() {
    const arr: any = [];
    this.labels.map((item: any) => {
      let obj = {
        text: item.name,
        value: item.name,
      };
      arr.push(obj);
    });
    return arr;
  }
  private tableData: any[] = [];
  private startOffset: number = 0;
  private endOffset: number = 0;
  private index: number = 0;

  private question: any = '';
  private questionText: any = '';

  get textList() {
    return this.json;
  }

  get labels() {
    const arr: any = [];
    this.json[this.index].labels.map((item: any, index: number) => {
      let obj = {
        id: index,
        name: item,
        color: index % 2 === 1 ? '#DDE6E8' : '#1FBC9C',
      };
      arr.push(obj);
    });
    return arr;
  }

  private json = require('@/assets/json/demo2.json');

  private mounted() {
    this.initText();
  }

  private initText() {
    const init = this.json[0];
    this.textTemp = this.text = init.text;
    this.question = init.question_text;
    this.questionText = init.problem_text;
  }

  private changeText(i: any, index: number) {
    this.textTemp = this.text = i.text;
    this.index = index;
    this.question = i.question_text;
    this.questionText = i.problem_text;
    this.tableData = [].concat(i.labeled);
  }

  private annotate(i: any) {
    if (this.endOffset === 0) {
      return;
    }
    const text = this.text.slice(this.startOffset + 1, this.endOffset + 1);
    const obj = {
      text: text,
      label: i.name,
      start: this.startOffset + 1,
      end: this.endOffset + 1,
    };
    this.tableData.push(obj);
    this.textList[this.index].labeled.push(obj);
    this.endOffset = 0;
  }
  private deleteRow(scope: any) {
    this.tableData.splice(scope.$index, 1);
    this.textList[this.index].labeled = [].concat(...this.tableData);
    this.rowHoverLeave();
  }

  private getSelection() {
    const sel = window.getSelection && window.getSelection(); // 得到selection对象
    let start!: number;
    let end!: number;
    // @ts-ignore
    const range = sel.getRangeAt(0); // 返回range对象
    [start, end] = [range.startOffset - 1, range.endOffset - 1];
    this.startOffset = start;
    this.endOffset = end;
  }

  private rowHover(row: any) {
    const styleSpan = '<span style="color:red;">' + row.text + '</span>';
    this.text = this.replaceChat(this.text, row.start, row.end, styleSpan);
  }
  private rowHoverLeave() {
    this.text = this.textTemp;
  }

  private replaceChat(
    source: string,
    start: number,
    end: number,
    newChar: string
  ) {
    var sFrontPart = source.substr(0, start);
    var sTailPart = source.substr(end, source.length);
    var sRet = sFrontPart + newChar + sTailPart;
    return sRet;
  }

  private filterTag(value: any, row: any) {
    return row.label === value;
  }

  private pre() {
    if (this.index === 0) {
      return;
    }
    this.index--;
    this.textTemp = this.text = this.textList[this.index].text;
  }

  private next() {
    if (this.index === this.textList.length - 1) {
      return;
    }
    this.index++;
    this.textTemp = this.text = this.textList[this.index].text;
  }
}
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  .text-list {
    height: 100%;
    width: 400px;
    background-color: #2a2e2f;
    border-right: 1px solid #dedede;
    overflow-y: auto;
    .text-item {
      font-size: 15px;
      color: #f3f3f3;
      font-weight: 500;
      text-align: left;
      // border-bottom: 1px dotted rgb(255, 255, 255);
      cursor: pointer;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      margin: 30px 10px;
      line-height: 30px;
    }
  }
  .annotation-wrapper {
    flex: 1;
    padding: 30px 0 10px 30px;
    display: flex;
    .annotation {
      width: 750px;
      .question {
        padding: 20px 0 10px 20px;
        align-items: center;
        color: #363636;
        display: flex;
        font-weight: 700;
        background-color: royalblue;
        flex-wrap: wrap;
        color: white;
      }
      .label-wrapper {
        padding: 20px 0 10px 20px;
        align-items: center;
        color: #363636;
        display: flex;
        font-weight: 700;
        background-color: royalblue;
        flex-wrap: wrap;
        .label {
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 4px;
          color: #4a4a4a;
          display: inline-flex;
          font-size: 0.75rem;
          height: 2em;
          justify-content: center;
          line-height: 1.5;
          white-space: nowrap;
          padding: 5px 10px;
          margin-right: 10px;
          cursor: pointer;
          margin-bottom: 10px;
        }
      }

      .text-data {
        background-color: #fff;
        box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
          0 0 0 1px rgba(10, 10, 10, 0.1);
        color: #4a4a4a;
        padding: 2rem;
        font-size: 16pt;
        line-height: 250%;
        margin-bottom: 20px;
        text-align: left;
        height: 80%;
        overflow-y: auto;
      }
    }

    .record {
      flex: 1;
      text-align: center;
    }
    .btns-left {
      position: absolute;
      top: 50%;
      left: 410px;
    }
    .btns-right {
      position: absolute;
      top: 50%;
      left: 1160px;
    }
  }
}
</style>
